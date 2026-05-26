/**
 * cmsCache — in-memory cache with optional sessionStorage persistence.
 *
 * Persistence makes the SECOND admin page load near-instant: Firestore reads
 * still happen in the background to refresh, but the UI shows the cached
 * payload immediately (zero-latency hydration).
 *
 * Goals:
 *   • De-duplicate Firestore reads across multiple hook instances
 *   • Provide stable references for repeated reads within `staleMs`
 *   • Allow explicit invalidation on mutation
 *   • Allow subscribers to be notified when a key updates
 *   • Survive page reloads (sessionStorage; cleared when tab closes)
 */

type Listener = () => void;

interface Entry<T> {
  value: T;
  /** epoch ms when written */
  ts: number;
}

const PERSIST_PREFIX = "csgpl_cache_";
const PERSIST_MAX_BYTES = 200_000; // skip persistence for anything bigger

const map = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<Listener>>();

/* ============================================================
   SESSION PERSISTENCE
   ============================================================ */

function persist(key: string, value: unknown, ts: number) {
  if (typeof sessionStorage === "undefined") return;
  try {
    const serialized = JSON.stringify({ value, ts });
    if (serialized.length > PERSIST_MAX_BYTES) return; // don't bloat session
    sessionStorage.setItem(PERSIST_PREFIX + key, serialized);
  } catch { /* quota — skip */ }
}

function clearPersisted(key?: string) {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (key) sessionStorage.removeItem(PERSIST_PREFIX + key);
    else {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(PERSIST_PREFIX)) sessionStorage.removeItem(k);
      }
    }
  } catch { /* noop */ }
}

/* Hydrate at module-load time so first cache.get() returns instantly. */
(function hydrate() {
  if (typeof sessionStorage === "undefined") return;
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (!k || !k.startsWith(PERSIST_PREFIX)) continue;
      const raw = sessionStorage.getItem(k);
      if (!raw) continue;
      try {
        const { value, ts } = JSON.parse(raw);
        if (value && typeof ts === "number") {
          map.set(k.slice(PERSIST_PREFIX.length), { value, ts });
        }
      } catch { /* skip corrupt */ }
    }
  } catch { /* noop */ }
})();

function notify(key: string) {
  const ls = listeners.get(key);
  if (ls) ls.forEach((l) => { try { l(); } catch { /* noop */ } });
}

export const cmsCache = {
  /** Read cached value if still fresh. `staleMs = 0` → always stale. */
  get<T>(key: string, staleMs = 30_000): T | undefined {
    const e = map.get(key) as Entry<T> | undefined;
    if (!e) return undefined;
    if (staleMs > 0 && Date.now() - e.ts > staleMs) return undefined;
    return e.value;
  },

  /** Get a possibly-stale value (no freshness check). Useful for instant render. */
  getStale<T>(key: string): T | undefined {
    return (map.get(key) as Entry<T> | undefined)?.value;
  },

  /** Write a value. Notifies subscribers + persists to session. */
  set<T>(key: string, value: T): void {
    const ts = Date.now();
    map.set(key, { value, ts });
    persist(key, value, ts);
    notify(key);
  },

  /** Invalidate one (or all if no key) — drops the entry & notifies subscribers. */
  invalidate(key?: string): void {
    if (key === undefined) {
      const keys = Array.from(map.keys());
      map.clear();
      clearPersisted();
      keys.forEach(notify);
    } else {
      map.delete(key);
      clearPersisted(key);
      notify(key);
    }
  },

  /**
   * De-duplicates a fetch promise so concurrent callers share one network round-trip.
   * Caller passes an idempotent loader. If a fetch is already in flight, the same
   * promise is returned.
   */
  async dedupe<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const existing = inflight.get(key) as Promise<T> | undefined;
    if (existing) return existing;
    const p = (async () => {
      try { return await loader(); }
      finally { inflight.delete(key); }
    })();
    inflight.set(key, p);
    return p;
  },

  /** Subscribe to cache updates for a key. Returns an unsubscribe fn. */
  subscribe(key: string, listener: Listener): () => void {
    let set = listeners.get(key);
    if (!set) { set = new Set(); listeners.set(key, set); }
    set.add(listener);
    return () => {
      const s = listeners.get(key);
      if (!s) return;
      s.delete(listener);
      if (!s.size) listeners.delete(key);
    };
  },
};
