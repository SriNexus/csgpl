/**
 * storage — production-grade upload pipeline.
 *
 * Pipeline:
 *   1. Validate file (MIME, size).
 *   2. Compress / resize (skips SVG / ICO / GIF).
 *   3. Try Firebase Storage upload with retry + backoff + cancel.
 *      • On success → use the public download URL.
 *      • On hard failure → encode original as data URL (≤4 MB).
 *   4. Persist a MediaRecord in the `media` Firestore collection.
 *      • Records width, height, MIME, size, originalSize.
 *   5. Return { url, record, source } for the caller.
 *
 * All steps emit structured `diagnostics` entries so failures are
 * inspectable from the admin debug page without devtools.
 */

import {
  deleteObject, getDownloadURL, ref as storageRef, uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import { storage, storageReady } from "@/lib/firebase";
import { localStore } from "./localStore";
import { cmsService } from "./cmsService";
import { describeFirebaseError, diagnostics } from "./diagnostics";
import {
  ACCEPTED_INPUT_ACCEPT, ACCEPTED_MIME_TYPES,
  MAX_DATA_URL_BYTES,
  processForUpload, sanitizeName, resolveContentType,
  type ProcessOptions,
} from "./imageProcessor";
import { uploadQueue } from "./uploadQueue";
import { sha256 } from "./hashing";
import { connectivity } from "./connectivity";
import { metrics } from "@/lib/logger";
import type { MediaRecord } from "../collections";

/* Re-export for back-compat with existing call sites. */
export { ACCEPTED_INPUT_ACCEPT, ACCEPTED_MIME_TYPES };

/* ============================================================
   TYPES
   ============================================================ */

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  /** 0–1 */
  ratio: number;
  /** Currently active retry attempt (1-indexed). */
  attempt: number;
}

export interface UploadResult {
  ok: boolean;
  /** Public URL — use directly in `<img src>`. */
  url?: string;
  /** Storage object path — only present for Firebase uploads. */
  storagePath?: string;
  /** Persisted MediaRecord (Firestore primary, local fallback secondary). */
  record?: MediaRecord;
  /** Where the file physically lives. */
  source?: "firebase" | "data-url";
  /** Bucket the file was written to (for diagnostics). */
  bucket?: string;
  /** Diagnostic detail when ok=false. */
  errorCode?: string;
  error?: string;
  remedy?: string;
}

export interface UploadOptions extends ProcessOptions {
  folder?: string;
  /** External cancel hook — call `controller.cancel()` to abort the upload. */
  signal?: UploadController;
  /** Retry tuning (defaults: 3 attempts, 400 ms base backoff). */
  retries?: number;
  backoffMs?: number;
  /** Hard ceiling for an entire upload attempt (default 90s). */
  timeoutMs?: number;
  /** Abort upload if no bytes move for this long (default 25s). */
  stallMs?: number;
  /** Skip duplicate-by-hash check (e.g. when re-uploading intentionally). */
  skipDedup?: boolean;
}

/** Cancellation handle exposed to upload callers. */
export interface UploadController {
  cancel: () => void;
  cancelled: () => boolean;
  _bind: (cb: () => void) => void; // internal — used by uploader to register the abort
  _unbind: () => void;
}

export function createUploadController(): UploadController {
  let cancelled = false;
  let cb: (() => void) | null = null;
  return {
    cancel() { cancelled = true; if (cb) try { cb(); } catch { /* noop */ } },
    cancelled: () => cancelled,
    _bind:    (fn) => { cb = fn; if (cancelled) try { fn(); } catch { /* noop */ } },
    _unbind:  () => { cb = null; },
  };
}

/* ============================================================
   HELPERS
   ============================================================ */

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

function mirrorLocally(record: MediaRecord) {
  localStore.insert<MediaRecord>("media", record);
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Read error"));
    reader.onload  = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   CORE UPLOAD (single attempt) — internal
   ============================================================ */

/** Upload + getDownloadURL with stall detection. */
async function uploadOnce(
  file: File,
  path: string,
  contentType: string,
  onProgress: (p: UploadProgress) => void,
  signal: UploadController | undefined,
  attempt: number,
  timeoutMs: number,
  stallMs: number,
): Promise<string> {
  if (!storage) throw new Error("Storage not initialised");
  const ref = storageRef(storage, path);
  const task: UploadTask = uploadBytesResumable(ref, file, { contentType });

  let lastTickedAt = Date.now();
  let lastBytes = 0;
  let stallTimer: number | undefined;
  let overallTimer: number | undefined;

  const cancelFn = () => task.cancel();
  signal?._bind(cancelFn);

  try {
    return await new Promise<string>((resolve, reject) => {
      // Hard ceiling — abort upload if it exceeds the overall timeout.
      overallTimer = window.setTimeout(() => {
        try { task.cancel(); } catch { /* noop */ }
        reject(Object.assign(new Error("Upload exceeded overall timeout"), { code: "storage/timeout" }));
      }, timeoutMs);

      // Stall watcher — abort if bytes haven't moved for `stallMs`.
      stallTimer = window.setInterval(() => {
        if (Date.now() - lastTickedAt > stallMs) {
          try { task.cancel(); } catch { /* noop */ }
          reject(Object.assign(new Error("Upload stalled — no bytes transferred"), { code: "storage/stalled" }));
        }
      }, Math.min(stallMs, 5_000));

      task.on(
        "state_changed",
        (s) => {
          if (s.bytesTransferred !== lastBytes) {
            lastTickedAt = Date.now();
            lastBytes = s.bytesTransferred;
          }
          onProgress({
            bytesTransferred: s.bytesTransferred,
            totalBytes:       s.totalBytes,
            ratio:            s.totalBytes ? s.bytesTransferred / s.totalBytes : 0,
            attempt,
          });
        },
        (err) => reject(err),
        async () => {
          try { resolve(await getDownloadURL(task.snapshot.ref)); }
          catch (e) { reject(e as Error); }
        }
      );
    });
  } finally {
    if (overallTimer) window.clearTimeout(overallTimer);
    if (stallTimer)   window.clearInterval(stallTimer);
    signal?._unbind();
  }
}

/* Decide whether an error is worth retrying. */
function isRetryable(code: string): boolean {
  if (!code) return true;
  if (code === "storage/canceled") return false;
  if (code === "storage/unauthorized") return false;
  if (code === "storage/unauthenticated") return false;
  if (code === "storage/quota-exceeded") return false;
  return true;
}

/* ============================================================
   PUBLIC API
   ============================================================ */

export const cmsStorage = {
  /**
   * Upload a single file with full validation, compression, retry & fallback.
   */
  async uploadImage(
    file: File,
    folder: string = "uploads",
    onProgress?: (p: UploadProgress) => void,
    opts: UploadOptions = {},
  ): Promise<UploadResult> {
    const scope = `storage.upload.${folder}`;
    diagnostics.info(scope, "Starting upload", { name: file?.name, size: file?.size, type: file?.type });

    // 1. Validate + compress
    const processed = await processForUpload(file, opts);
    if (!processed.ok || !processed.result) {
      diagnostics.warn(scope, "Validation failed", { error: processed.error });
      return { ok: false, error: processed.error || "Invalid file" };
    }
    const proc = processed.result;
    const fileForUpload = proc.file;
    const contentType = proc.contentType;

    /* --- 1a. Compute content hash (deduplication key) --- */
    let hash: string | undefined;
    try { hash = await sha256(fileForUpload); }
    catch (e: any) { diagnostics.warn(scope, "hash failed (continuing)", { error: e?.message }); }

    /* --- 1b. Duplicate detection — look for existing record with same hash --- */
    if (!opts.skipDedup && hash) {
      const existing = localStore.readAll<MediaRecord>("media").find((m) => m.hash === hash);
      if (existing) {
        diagnostics.info(scope, "Duplicate detected — reusing existing media", { id: existing.id, url: existing.url });
        onProgress?.({ bytesTransferred: fileForUpload.size, totalBytes: fileForUpload.size, ratio: 1, attempt: 1 });
        return { ok: true, url: existing.url, storagePath: existing.storagePath, record: existing, source: "firebase" };
      }
    }

    /* --- 1c. Preflight: refuse if offline AND file too big for data-URL fallback --- */
    if (!connectivity.isOnline() && fileForUpload.size > MAX_DATA_URL_BYTES) {
      const msg = "Network is offline and file is too large for local fallback.";
      diagnostics.error(scope, msg);
      return { ok: false, errorCode: "network/offline", error: msg };
    }

    const safeName    = sanitizeName(fileForUpload.name);
    const timestamp   = Date.now();
    const storagePath = `${folder}/${timestamp}_${safeName}`;

    let url: string | undefined;
    let usedStoragePath: string | undefined;
    let usedSource: "firebase" | "data-url";
    usedSource = "data-url";
    let lastErrorCode: string | undefined;
    let lastErrorMessage: string | undefined;
    let lastErrorRemedy: string | undefined;

    /* ---------- 2. Firebase upload (queued, retried, timed) ---------- */
    if (storageReady() && storage) {
      const maxAttempts = Math.max(1, opts.retries ?? 3);
      const baseBackoff = opts.backoffMs ?? 400;
      const timeoutMs   = opts.timeoutMs ?? 90_000;
      const stallMs     = opts.stallMs   ?? 25_000;

      // The whole retry loop runs inside the bounded-concurrency queue
      // so 20 simultaneous drops don't stampede Storage.
      await uploadQueue.run(async () => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          if (opts.signal?.cancelled()) {
            diagnostics.warn(scope, "Upload cancelled by user", { attempt });
            lastErrorCode = "storage/canceled";
            lastErrorMessage = "Upload cancelled.";
            return;
          }
          try {
            diagnostics.debug(scope, `Attempt ${attempt}/${maxAttempts}`, { path: storagePath });
            metrics.incr("storageUploads");
            url = await uploadOnce(
              fileForUpload, storagePath, contentType,
              (p) => onProgress?.(p),
              opts.signal,
              attempt,
              timeoutMs,
              stallMs,
            );
            usedStoragePath = storagePath;
            usedSource = "firebase";
            connectivity.clearFirebaseError();
            diagnostics.info(scope, "Upload succeeded", { attempt, path: storagePath, url });
            return;
          } catch (e) {
            const dx = describeFirebaseError(e);
            lastErrorCode    = dx.code;
            lastErrorMessage = dx.message;
            lastErrorRemedy  = dx.remedy;
            connectivity.recordFirebaseError(dx.message);
            diagnostics.warn(scope, `Attempt ${attempt} failed (${dx.code})`, dx);

            if (!isRetryable(dx.code) || attempt === maxAttempts) return;
            const wait = baseBackoff * 2 ** (attempt - 1) + Math.random() * 150;
            diagnostics.debug(scope, `Backing off ${Math.round(wait)}ms before retry`);
            await sleep(wait);
          }
        }
      });

      if (lastErrorCode === "storage/canceled") {
        return { ok: false, errorCode: "storage/canceled", error: "Upload cancelled." };
      }
    } else {
      diagnostics.warn(scope, "Storage not ready — using data-URL fallback");
    }

    /* ---------- 3. Data URL fallback ---------- */
    if (!url) {
      if (fileForUpload.size > MAX_DATA_URL_BYTES) {
        const msg = `File too large for local fallback (${(fileForUpload.size / 1024 / 1024).toFixed(1)} MB > ${MAX_DATA_URL_BYTES / 1024 / 1024} MB cap).`;
        diagnostics.error(scope, msg);
        return {
          ok: false,
          errorCode: lastErrorCode || "fallback/too-large",
          error: lastErrorMessage ? `${lastErrorMessage} — ${msg}` : msg,
          remedy: lastErrorRemedy,
        };
      }
      try {
        url = await fileToDataUrl(fileForUpload);
        diagnostics.info(scope, "Stored via data-URL fallback", { bytes: fileForUpload.size });
        onProgress?.({ bytesTransferred: fileForUpload.size, totalBytes: fileForUpload.size, ratio: 1, attempt: 1 });
      } catch (e: any) {
        const msg = e?.message || "Failed to read file";
        diagnostics.error(scope, "Data-URL fallback failed", { error: msg });
        return {
          ok: false,
          errorCode: lastErrorCode || "fallback/read-failed",
          error: lastErrorMessage ? `${lastErrorMessage} — ${msg}` : msg,
          remedy: lastErrorRemedy,
        };
      }
    }

    /* ---------- 4. Build MediaRecord (Firestore write is fire-and-forget) ---------- */
    const recordPayload: Omit<MediaRecord, "id"> = {
      name:        safeName,
      url,
      storagePath: usedStoragePath,
      contentType,
      size:        fileForUpload.size,
      folder,
      label:       file.name,
      width:       proc.dimensions?.width,
      height:      proc.dimensions?.height,
      originalSize:proc.originalSize,
      originalType:proc.originalType,
      compressed:  proc.compressed,
      hash,
      refCount:    0,
    };

    // Optimistic record — caller gets this IMMEDIATELY (no Firestore wait).
    const optimisticRecord: MediaRecord = {
      ...recordPayload,
      id: `tmp-${timestamp}`,
      createdAt: new Date().toISOString(),
    };

    // Mirror locally synchronously so the Media Library reflects without waiting
    // for the Firestore round-trip.
    mirrorLocally(optimisticRecord);

    // Fire Firestore write in background — caller never blocks on it.
    void (async () => {
      try {
        const res = await cmsService.create<MediaRecord>("media", recordPayload);
        if (res.ok && res.data) {
          // Replace the local mirror with the real Firestore record
          localStore.remove("media", optimisticRecord.id);
          localStore.insert<MediaRecord>("media", res.data);
          diagnostics.info(scope, "Firestore record created", { id: res.data.id });
        } else {
          diagnostics.warn(scope, "Firestore record write failed — kept local mirror", { error: res.error });
        }
      } catch (e: any) {
        diagnostics.warn(scope, "Firestore record write threw — kept local mirror", { error: e?.message });
      }
    })();

    return {
      ok: true,
      url,
      storagePath: usedStoragePath,
      record: optimisticRecord,
      source: usedSource,
      bucket: (usedSource as string) === "firebase" ? (storage as any)?.app?.options?.storageBucket : undefined,
    };
  },

  /**
   * Delete a media asset (best-effort Storage delete + Firestore remove).
   */
  async deleteMedia(record: MediaRecord): Promise<{ ok: boolean; error?: string }> {
    if (record.storagePath && storageReady() && storage) {
      try {
        await deleteObject(storageRef(storage, record.storagePath));
        diagnostics.info("storage.delete", "Storage object removed", { path: record.storagePath });
      } catch (e: any) {
        const dx = describeFirebaseError(e);
        diagnostics.warn("storage.delete", `Object delete failed: ${dx.code}`, dx);
      }
    }
    const res = await cmsService.remove("media", record.id);
    return res.ok ? { ok: true } : { ok: false, error: res.error };
  },

  /** Internals exposed for the upload helper tests / health page. */
  listLocalMedia(): MediaRecord[] {
    return localStore.readAll<MediaRecord>("media");
  },
  removeLocalMedia(id: string) {
    localStore.remove("media", id);
  },
  /** Resolve a guessed content type — re-exported convenience. */
  resolveContentType,
};
