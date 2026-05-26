/**
 * imageProcessor — client-side validation, dimension extraction
 * and optional resizing/compression before upload.
 *
 * Pure helpers, no Firebase. Returns plain values; the upload pipeline
 * decides what to do with them.
 *
 * Why compress in-browser?
 *   • Mobile cameras produce 8–15 MB photos that explode Storage quota
 *   • Smaller payloads = faster uploads, fewer Firebase failures
 *   • SVG/ICO/GIF are skipped (already small or vector)
 */

import { diagnostics } from "./diagnostics";

/* ============================================================
   CONSTANTS
   ============================================================ */

export const ACCEPTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/gif",
] as const;

export const ACCEPTED_INPUT_ACCEPT =
  ".png,.jpg,.jpeg,.webp,.svg,.ico,.gif,image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/gif";

export const MAX_STORAGE_BYTES = 15 * 1024 * 1024; // 15 MB hard cap
export const MAX_DATA_URL_BYTES = 4 * 1024 * 1024; // local fallback cap

/* MIME types that we never resample (vector / animated / icon). */
const SKIP_COMPRESSION = new Set<string>([
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/gif",
]);

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImage {
  /** The file to actually upload (possibly compressed copy of the original). */
  file: File;
  /** Original file metadata — surfaced in MediaRecord. */
  originalSize: number;
  originalType: string;
  /** Final image dimensions (after resize, when applicable). */
  dimensions?: ImageDimensions;
  /** Final MIME type after processing. */
  contentType: string;
  /** True when the file was rewritten by the compressor. */
  compressed: boolean;
}

export interface ProcessOptions {
  /** Largest edge in px. Defaults to 1920 (full-HD width). */
  maxEdge?: number;
  /** JPEG/WebP quality 0–1. Defaults to 0.85. */
  quality?: number;
  /** Set true to skip compression entirely. */
  skip?: boolean;
}

/* ============================================================
   VALIDATION
   ============================================================ */

export interface ValidationResult { ok: boolean; error?: string }

export function validateFile(file: File): ValidationResult {
  if (!file)              return { ok: false, error: "No file selected." };
  if (!file.name)         return { ok: false, error: "File is missing a name." };

  const type = resolveContentType(file);
  if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(type)) {
    return { ok: false, error: `Unsupported type "${type}". Allowed: PNG, JPG, WebP, SVG, ICO, GIF.` };
  }
  if (file.size === 0) {
    return { ok: false, error: "File is empty." };
  }
  if (file.size > MAX_STORAGE_BYTES) {
    return { ok: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_STORAGE_BYTES / 1024 / 1024} MB.` };
  }
  return { ok: true };
}

/* ============================================================
   MIME RESOLUTION
   ============================================================ */

function fileExtFromName(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : "";
}

export function resolveContentType(file: File): string {
  if (file.type) return file.type;
  const ext = fileExtFromName(file.name);
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    gif: "image/gif",
  };
  return map[ext] || "application/octet-stream";
}

export function sanitizeName(name: string) {
  return name.replace(/[^a-z0-9_.-]/gi, "_");
}

/* ============================================================
   DIMENSION READER
   ============================================================ */

export async function readDimensions(file: File): Promise<ImageDimensions | undefined> {
  const type = resolveContentType(file);
  // SVG dimensions are unreliable without an XML parser; skip
  if (type === "image/svg+xml" || type === "image/x-icon" || type === "image/vnd.microsoft.icon") {
    return undefined;
  }
  try {
    const url = URL.createObjectURL(file);
    try {
      const dims = await new Promise<ImageDimensions>((resolve, reject) => {
        const img = new Image();
        img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error("decode failed"));
        img.src = url;
      });
      return dims;
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (e) {
    diagnostics.warn("image.dimensions", "Failed to read dimensions", { name: file.name, error: String(e) });
    return undefined;
  }
}

/* ============================================================
   COMPRESSION / RESIZE
   ============================================================ */

/** Files under this size skip compression entirely — already small enough. */
const FAST_PATH_BYTES = 500 * 1024; // 500 KB

/**
 * Resize + recompress a raster image. Returns the original file untouched
 * when:
 *   • The MIME type is in `SKIP_COMPRESSION`
 *   • The file is already small (≤500 KB → no decode, no canvas, no work)
 *   • The image is already smaller than `maxEdge`
 *   • Compression failed for any reason (browser / canvas issue)
 *   • The "compressed" version is *larger* than the original
 */
export async function compressImage(
  file: File,
  opts: ProcessOptions = {}
): Promise<{ file: File; compressed: boolean; dimensions?: ImageDimensions }> {
  const type = resolveContentType(file);
  if (opts.skip || SKIP_COMPRESSION.has(type)) {
    // Fire-and-forget dimension read — don't block upload on it
    return { file, compressed: false };
  }

  // Fast-path for already-small files (logos, icons, thumbnails)
  if (file.size <= FAST_PATH_BYTES) {
    return { file, compressed: false };
  }

  const maxEdge = opts.maxEdge ?? 1920;
  const quality = clamp01(opts.quality ?? 0.85);

  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("decode failed"));
      i.src = url;
    }).finally(() => URL.revokeObjectURL(url));

    const { naturalWidth: w, naturalHeight: h } = img;
    const dims: ImageDimensions = { width: w, height: h };

    // Skip work if already small enough (kept for the 500KB–1.5MB band)
    const longestEdge = Math.max(w, h);
    if (longestEdge <= maxEdge && file.size <= 1.5 * 1024 * 1024) {
      return { file, compressed: false, dimensions: dims };
    }

    // Compute target size
    const scale = longestEdge > maxEdge ? maxEdge / longestEdge : 1;
    const tw = Math.round(w * scale);
    const th = Math.round(h * scale);

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, compressed: false, dimensions: dims };
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, tw, th);

    // Re-encode. Keep PNG → PNG (preserves transparency).
    const targetType: "image/jpeg" | "image/webp" | "image/png" =
      type === "image/png" ? "image/png"
      : type === "image/webp" ? "image/webp"
      : "image/jpeg";

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetType, targetType === "image/png" ? undefined : quality)
    );

    if (!blob) return { file, compressed: false, dimensions: dims };

    // If the "compressed" version is larger than the original, keep the original.
    if (blob.size >= file.size) {
      diagnostics.debug("image.compress", "Compression no-op (output ≥ input)", { name: file.name, originalBytes: file.size, candidateBytes: blob.size });
      return { file, compressed: false, dimensions: dims };
    }

    // Reconstruct a File so File.name & lastModified are preserved.
    const compressedFile = new File([blob], replaceExtension(sanitizeName(file.name), extensionFor(targetType)), {
      type: targetType,
      lastModified: file.lastModified,
    });

    diagnostics.info("image.compress", "Compressed image", {
      name: file.name,
      original: { bytes: file.size, type, width: w, height: h },
      output:   { bytes: compressedFile.size, type: targetType, width: tw, height: th },
      saved: `${Math.round((1 - compressedFile.size / file.size) * 100)}%`,
    });

    return { file: compressedFile, compressed: true, dimensions: { width: tw, height: th } };
  } catch (e) {
    diagnostics.warn("image.compress", "Compression failed — uploading original", { error: String(e), name: file.name });
    return { file, compressed: false };
  }
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function extensionFor(mime: string) {
  return mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
}
function replaceExtension(name: string, ext: string) {
  return name.replace(/\.[a-z0-9]+$/i, "") + "." + ext;
}

/* ============================================================
   ORCHESTRATED PROCESS
   ============================================================ */

/** Validate → compress → measure. Returns everything the uploader needs. */
export async function processForUpload(
  file: File,
  opts: ProcessOptions = {}
): Promise<{ ok: boolean; result?: ProcessedImage; error?: string }> {
  const v = validateFile(file);
  if (!v.ok) return { ok: false, error: v.error };

  const originalSize = file.size;
  const originalType = resolveContentType(file);

  const { file: out, compressed, dimensions } = await compressImage(file, opts);
  return {
    ok: true,
    result: {
      file: out,
      originalSize,
      originalType,
      contentType: resolveContentType(out),
      compressed,
      dimensions,
    },
  };
}

/** Asynchronously read dimensions — used by the upload pipeline AFTER the
 *  upload completes so dimensions don't block the UI. */
export async function readDimensionsLater(file: File): Promise<ImageDimensions | undefined> {
  return readDimensions(file);
}
