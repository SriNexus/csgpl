/**
 * logger — production-aware logging abstraction.
 *
 * In dev:   console.log / warn / error are passed through.
 * In prod:  only warnings and errors reach the console.
 *           debug/info entries still feed `diagnostics` (visible in the
 *           admin debug page) so post-mortem inspection works without
 *           polluting the production console.
 */

import { diagnostics } from "@/cms/services/diagnostics";

const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

export const log = {
  debug: (scope: string, message: string, data?: any) => {
    diagnostics.debug(scope, message, data);
  },
  info: (scope: string, message: string, data?: any) => {
    if (isDev) diagnostics.info(scope, message, data);
    else diagnostics.info(scope, message, data); // diagnostics handles console internally
  },
  warn: (scope: string, message: string, data?: any) => {
    diagnostics.warn(scope, message, data);
  },
  error: (scope: string, message: string, data?: any) => {
    diagnostics.error(scope, message, data);
  },
};

/* ============================================================
   PERF TRACING
   ============================================================ */

export interface PerfTrace {
  name: string;
  startedAt: number;
  /** End the trace and emit a log entry. */
  end: (data?: Record<string, any>) => number;
}

/**
 * Lightweight perf tracer. Use sparingly — every call adds a diagnostic entry.
 *
 *   const t = perf.start("storage.upload");
 *   // … work …
 *   t.end({ bytes: 1024 });
 */
export const perf = {
  start(name: string): PerfTrace {
    const startedAt = performance.now();
    return {
      name,
      startedAt,
      end(data) {
        const ms = Math.round(performance.now() - startedAt);
        log.debug("perf", `${name} · ${ms}ms`, { ms, ...data });
        return ms;
      },
    };
  },
};

/* ============================================================
   RATE LIMITER (admin mutations)
   ============================================================ */

const buckets = new Map<string, number[]>();

/**
 * Returns true when the action is allowed (and records the call).
 * Returns false when the rate is exceeded — caller should refuse.
 *
 *   if (!rateLimit("create.blog", 10, 60_000)) toast.error("Slow down…");
 */
export function rateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = buckets.get(key) || [];
  // Drop expired entries
  const fresh = arr.filter((t) => now - t < windowMs);
  if (fresh.length >= maxCalls) {
    buckets.set(key, fresh);
    log.warn("rate.limit", `Action "${key}" exceeded ${maxCalls}/${windowMs}ms`, { calls: fresh.length });
    return false;
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return true;
}

/* ============================================================
   FIRESTORE/STORAGE INSTRUMENTATION COUNTERS
   ============================================================ */

const counters = { firestoreReads: 0, firestoreWrites: 0, storageUploads: 0, storageDeletes: 0 };

export const metrics = {
  incr(key: keyof typeof counters) { counters[key]++; },
  snapshot() { return { ...counters }; },
  reset() { Object.keys(counters).forEach((k) => (counters as any)[k] = 0); },
};
