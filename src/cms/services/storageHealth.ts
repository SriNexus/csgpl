/**
 * storageHealth — runtime self-test for the Firebase Storage pipeline.
 *
 * Performs a tiny upload (~30 bytes) to `_healthcheck/<timestamp>.txt`,
 * waits for the download URL, then deletes the object. The full round-trip
 * exercises every layer (Auth → CORS → write rules → URL signing → delete
 * rules) and surfaces clear diagnostics for each failure mode.
 *
 * Called manually from `/admin/debug/storage`. Never auto-invoked.
 */

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage, storageReady, getFirebaseStatus } from "@/lib/firebase";
import { describeFirebaseError, diagnostics } from "./diagnostics";

export interface HealthStep {
  name: string;
  ok: boolean;
  ms?: number;
  error?: string;
  details?: any;
}

export interface HealthReport {
  ok: boolean;
  steps: HealthStep[];
  startedAt: number;
  finishedAt: number;
  /** The download URL that was generated during the round-trip (proves end-to-end). */
  sampleUrl?: string;
}

async function timed<T>(label: string, fn: () => Promise<T>): Promise<{ ok: true; value: T; step: HealthStep } | { ok: false; step: HealthStep }> {
  const t0 = performance.now();
  try {
    const value = await fn();
    return { ok: true, value, step: { name: label, ok: true, ms: Math.round(performance.now() - t0) } };
  } catch (e: any) {
    const dx = describeFirebaseError(e);
    diagnostics.error("storage.health", `${label} failed`, dx);
    return { ok: false, step: { name: label, ok: false, ms: Math.round(performance.now() - t0), error: dx.message, details: dx } };
  }
}

export async function runStorageHealthCheck(): Promise<HealthReport> {
  const startedAt = Date.now();
  const steps: HealthStep[] = [];
  let sampleUrl: string | undefined;

  // 1. Init check
  const init = getFirebaseStatus();
  steps.push({
    name: "Firebase initialised",
    ok: init.initialized,
    details: { bucket: init.bucket, storageOk: init.storageOk, authOk: init.authOk },
    error: init.initialized ? undefined : "Firebase SDK did not initialise — check console for details.",
  });
  if (!init.initialized) return finish(false);

  // 2. Storage init check
  steps.push({
    name: "Storage SDK ready",
    ok: storageReady(),
    error: storageReady() ? undefined : "Storage SDK failed to initialise — typically a bad bucket URL or quota.",
  });
  if (!storageReady() || !storage) return finish(false);

  // 3. Auth check (admin upload rules typically require auth)
  const signedIn = !!auth?.currentUser;
  steps.push({
    name: "Admin signed in (Firebase Auth)",
    ok: signedIn,
    details: { uid: auth?.currentUser?.uid, email: auth?.currentUser?.email },
    error: signedIn ? undefined : "No Firebase Auth user. Storage rules typically require an authenticated admin. (Demo session is fine for local fallback but won't satisfy real Storage rules.)",
  });

  // 4. Sample upload (small text blob)
  const path = `_healthcheck/${Date.now()}-${Math.floor(Math.random() * 9999)}.txt`;
  const objectRef = ref(storage, path);
  const payload = new Blob([`csgpl healthcheck ${new Date().toISOString()}`], { type: "text/plain" });

  const upload = await timed("Upload sample object", () => uploadBytes(objectRef, payload, { contentType: "text/plain" }));
  steps.push(upload.step);
  if (!upload.ok) return finish(false);

  // 5. Download URL
  const dl = await timed("Resolve download URL", () => getDownloadURL(objectRef));
  steps.push(dl.step);
  if (dl.ok) sampleUrl = dl.value;

  // 6. Delete
  const del = await timed("Delete sample object", () => deleteObject(objectRef));
  steps.push(del.step);

  return finish(steps.every((s) => s.ok));

  function finish(ok: boolean): HealthReport {
    const report: HealthReport = { ok, steps, startedAt, finishedAt: Date.now(), sampleUrl };
    diagnostics.info("storage.health", `Health check ${ok ? "passed" : "FAILED"}`, { steps });
    return report;
  }
}
