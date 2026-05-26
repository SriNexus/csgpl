/**
 * diagnostics — structured log buffer for the media pipeline.
 *
 * Every upload, retry, fallback, and error gets recorded here. The admin
 * `/admin/debug/storage` page reads the buffer to surface failures to
 * non-technical operators without making them open devtools.
 *
 * Design:
 *   • In-memory ring buffer (last 200 entries) — no Firestore writes
 *   • Module-scoped pub/sub (no React context required)
 *   • Mirrored to console with consistent prefix `[csgpl]`
 */

export type DiagSeverity = "debug" | "info" | "warn" | "error";

export interface DiagEntry {
  id: number;
  time: number;          // epoch ms
  severity: DiagSeverity;
  scope: string;         // e.g. "storage.upload", "branding.save"
  message: string;
  data?: any;
}

type Listener = (entries: DiagEntry[]) => void;

const MAX = 200;
let buffer: DiagEntry[] = [];
let counter = 1;
const listeners = new Set<Listener>();

function notify() {
  const snapshot = buffer.slice();
  listeners.forEach((l) => { try { l(snapshot); } catch { /* noop */ } });
}

function record(severity: DiagSeverity, scope: string, message: string, data?: any) {
  const entry: DiagEntry = {
    id: counter++,
    time: Date.now(),
    severity,
    scope,
    message,
    data,
  };
  buffer = [entry, ...buffer].slice(0, MAX);
  notify();

  /* eslint-disable no-console */
  const fn = severity === "error" ? console.error
           : severity === "warn"  ? console.warn
           : severity === "debug" ? console.debug
           : console.info;
  if (data !== undefined) fn(`[csgpl ${scope}] ${message}`, data);
  else fn(`[csgpl ${scope}] ${message}`);
  /* eslint-enable no-console */
}

export const diagnostics = {
  debug: (scope: string, message: string, data?: any) => record("debug", scope, message, data),
  info:  (scope: string, message: string, data?: any) => record("info",  scope, message, data),
  warn:  (scope: string, message: string, data?: any) => record("warn",  scope, message, data),
  error: (scope: string, message: string, data?: any) => record("error", scope, message, data),

  list(): DiagEntry[] { return buffer.slice(); },
  clear(): void { buffer = []; notify(); },

  subscribe(l: Listener): () => void {
    listeners.add(l);
    l(buffer.slice());
    return () => { listeners.delete(l); };
  },
};

/**
 * Normalize any Firebase / browser error into a human-readable diagnostic.
 * Firebase Storage errors arrive with codes like `storage/unauthorized`,
 * `storage/canceled`, `storage/quota-exceeded`, etc. We translate the most
 * common ones so admins know how to fix them.
 */
export function describeFirebaseError(e: unknown): { code: string; message: string; remedy?: string } {
  const err: any = e || {};
  const code: string = err.code || err.name || "unknown";
  const raw: string  = err.message || String(e);

  switch (code) {
    case "storage/unauthorized":
      return {
        code, message: "Storage rejected the upload (unauthorized).",
        remedy: "Storage rules require an authenticated admin. Confirm you are signed in and that storage.rules grants write access for image/* uploads ≤15 MB.",
      };
    case "storage/canceled":
      return { code, message: "Upload was canceled.", remedy: "Click upload again if this was unintended." };
    case "storage/quota-exceeded":
      return { code, message: "Storage bucket quota exceeded.", remedy: "Free up storage in the Firebase console or upgrade the plan." };
    case "storage/unauthenticated":
      return { code, message: "Not signed in.", remedy: "Sign in to /admin/login and try again." };
    case "storage/retry-limit-exceeded":
      return { code, message: "Upload retried too many times.", remedy: "Check your network connection. Large files over slow networks may need a smaller file." };
    case "storage/invalid-checksum":
      return { code, message: "File integrity check failed.", remedy: "Re-select the file and try again — the local copy may be corrupt." };
    case "storage/server-file-wrong-size":
      return { code, message: "Server received a wrong-sized file.", remedy: "Retry the upload." };
    case "storage/object-not-found":
      return { code, message: "Storage object not found.", remedy: "The file may have already been deleted." };
    case "storage/unknown":
    case "unknown":
      // Most common cause: CORS preflight failure
      if (/CORS|cors|preflight|Network|Failed to fetch/i.test(raw)) {
        return {
          code: "cors",
          message: "Storage CORS error — browser blocked the request.",
          remedy: "Run `gsutil cors set deploy/cors.json gs://csgpl-83618.firebasestorage.app` to allow uploads from this domain.",
        };
      }
      return { code, message: raw || "Unknown storage error", remedy: undefined };
    default:
      return { code, message: raw || `Storage error: ${code}` };
  }
}
