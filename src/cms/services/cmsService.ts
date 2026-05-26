/**
 * cmsService — unified CMS facade with caching + realtime support.
 *
 * Read path:
 *   1. cmsCache (within staleMs)
 *   2. Firestore (deduped via cmsCache.dedupe)
 *   3. localStore
 *   4. seed data
 *
 * Write path:
 *   1. Firestore mutation
 *   2. on failure → localStore mutation
 *   3. invalidate cache → notify subscribers
 *
 * Realtime path (opt-in):
 *   subscribeCollection / subscribeDoc → onSnapshot → cache.set → notify subscribers
 */

import { firestoreClient } from "./firestoreClient";
import { localStore } from "./localStore";
import { cmsCache } from "./cmsCache";
import { metrics } from "@/lib/logger";
import type { CmsRecord, CmsResult, CmsSource, Id } from "../types";
import {
  cmsCollections, type CollectionKey,
  siteDocsSeed, type SiteDocs, type SiteDocKey,
} from "../collections";

/* ============== KEY BUILDERS ============== */

const colKey = (key: string) => `col:${key}`;
const docKey = (key: string) => `doc:${key}`;

const DOC_PATH = "pages/home/sections";

/* ============== CACHE PATCHER ============== */
/**
 * Apply a transformation to the cached collection array and notify subscribers.
 * Returns silently when there's no cached payload (next read will fetch fresh).
 */
function patchCache<T extends CmsRecord>(
  collectionKey: string,
  transform: (rows: T[]) => T[]
) {
  const ck = colKey(collectionKey);
  const cached = cmsCache.getStale<{ data: T[]; source: CmsSource }>(ck);
  const nextRows = transform(cached?.data ?? []);
  cmsCache.set(ck, { data: nextRows, source: cached?.source ?? "local" });
}

/* ============== INTERNAL HELPERS ============== */

async function listMerged<T extends CmsRecord>(
  collectionKey: string,
  seed: T[]
): Promise<{ data: T[]; source: CmsSource }> {
  if (firestoreClient.ready()) {
    try {
      metrics.incr("firestoreReads");
      const remote = await firestoreClient.list<T>(collectionKey, "createdAt");
      if (remote.length) return { data: remote, source: "firestore" };
    } catch (e) {
      console.warn(`[cms] list("${collectionKey}") fallback to local:`, e);
    }
  }
  const local = localStore.readAll<T>(collectionKey);
  if (local.length) return { data: local, source: "local" };
  return { data: seed, source: "fallback" };
}

/* ============== PUBLIC SERVICE ============== */

export const cmsService = {
  /* ============ COLLECTIONS ============ */

  /**
   * List a collection. Honours the in-memory cache for `staleMs` (default 30s).
   * Concurrent calls share a single network request.
   */
  async list<K extends CollectionKey>(
    key: K,
    opts: { staleMs?: number } = {}
  ): Promise<{ data: any[]; source: CmsSource }> {
    const def = cmsCollections[key];
    const ck = colKey(def.key);
    const staleMs = opts.staleMs ?? 5 * 60_000; // 5 minutes default

    // Fresh cache hit — instant return
    const fresh = cmsCache.get<{ data: any[]; source: CmsSource }>(ck, staleMs);
    if (fresh) return fresh;

    // Dedupe concurrent fetches
    return cmsCache.dedupe(ck, async () => {
      const r = await listMerged(def.key, def.seed as any);
      cmsCache.set(ck, r);
      return r;
    });
  },

  async create<T extends CmsRecord>(key: CollectionKey, payload: Omit<T, "id">): Promise<CmsResult<T>> {
    const def = cmsCollections[key];

    // 1. Write locally + patch cache IMMEDIATELY so UI reflects instantly
    const localCreated = localStore.insert<T>(def.key, payload as any);
    patchCache<T>(def.key, (rows) => [localCreated, ...rows]);

    if (!firestoreClient.ready()) {
      return { ok: true, data: localCreated };
    }

    // 2. Fire Firestore write in background — replace local stub on success
    void (async () => {
      try {
        metrics.incr("firestoreWrites");
        const created = await firestoreClient.create<T>(def.key, payload);
        localStore.remove(def.key, localCreated.id);
        localStore.insert<T>(def.key, created as any);
        patchCache<T>(def.key, (rows) =>
          rows.map((r) => (r.id === localCreated.id ? created : r))
        );
      } catch (e: any) {
        console.warn(`[cms] create("${def.key}") background write failed:`, e);
      }
    })();

    return { ok: true, data: localCreated };
  },

  async update<T extends CmsRecord>(key: CollectionKey, id: Id, patch: Partial<T>): Promise<CmsResult<Partial<T>>> {
    const def = cmsCollections[key];

    // 1. Write locally + patch cache immediately
    const localUpdated = localStore.update<T>(def.key, id, patch);
    patchCache<T>(def.key, (rows) =>
      rows.map((r) => (r.id === id ? ({ ...r, ...patch } as T) : r))
    );

    if (!firestoreClient.ready()) {
      return localUpdated ? { ok: true, data: localUpdated } : { ok: false, error: "Not found" };
    }

    // 2. Background sync
    void (async () => {
      try {
        metrics.incr("firestoreWrites");
        await firestoreClient.update<T>(def.key, id, patch);
      } catch (e: any) { console.warn(`[cms] update("${def.key}") background write failed:`, e); }
    })();

    return { ok: true, data: { id, ...patch } as Partial<T> };
  },

  async remove(key: CollectionKey, id: Id): Promise<CmsResult> {
    const def = cmsCollections[key];

    // 1. Remove locally + patch cache immediately
    localStore.remove(def.key, id);
    patchCache<CmsRecord>(def.key, (rows) => rows.filter((r) => r.id !== id));

    if (!firestoreClient.ready()) {
      return { ok: true };
    }

    // 2. Background delete
    void (async () => {
      try {
        metrics.incr("firestoreWrites");
        await firestoreClient.remove(def.key, id);
      } catch (e: any) { console.warn(`[cms] remove("${def.key}") background delete failed:`, e); }
    })();

    return { ok: true };
  },

  /**
   * Realtime subscription for a collection.
   * Returns an unsubscribe fn. No-op + console.warn if Firestore unavailable.
   */
  subscribeCollection<K extends CollectionKey>(
    key: K,
    onData: (data: any[]) => void
  ): () => void {
    const def = cmsCollections[key];
    if (!firestoreClient.ready()) {
      console.warn(`[cms] subscribeCollection("${def.key}"): Firestore unavailable`);
      return () => {};
    }
    return firestoreClient.watchCollection<any>(
      def.key,
      "createdAt",
      (rows) => {
        // mirror into cache so other consumers benefit
        cmsCache.set(colKey(def.key), { data: rows, source: "firestore" });
        onData(rows);
      },
      (err) => console.warn(`[cms] subscribeCollection("${def.key}") error:`, err)
    );
  },

  /* ============ DOCUMENTS ============ */

  async getDoc<K extends SiteDocKey>(
    key: K,
    opts: { staleMs?: number } = {}
  ): Promise<{ data: SiteDocs[K]; source: CmsSource }> {
    const dk = docKey(String(key));
    const staleMs = opts.staleMs ?? 5 * 60_000;

    const cached = cmsCache.get<{ data: SiteDocs[K]; source: CmsSource }>(dk, staleMs);
    if (cached) return cached;

    return cmsCache.dedupe(dk, async () => {
      if (firestoreClient.ready()) {
        try {
          metrics.incr("firestoreReads");
          const remote = await firestoreClient.getDoc<SiteDocs[K]>(DOC_PATH, String(key));
          if (remote) {
            const r = { data: remote, source: "firestore" as CmsSource };
            cmsCache.set(dk, r);
            return r;
          }
        } catch (e) {
          console.warn(`[cms] getDoc("${String(key)}") fallback to local:`, e);
        }
      }
      const local = localStore.readDoc<SiteDocs[K]>(String(key));
      if (local) {
        const r = { data: local, source: "local" as CmsSource };
        cmsCache.set(dk, r);
        return r;
      }
      const r = { data: siteDocsSeed[key], source: "fallback" as CmsSource };
      cmsCache.set(dk, r);
      return r;
    });
  },

  async setDoc<K extends SiteDocKey>(key: K, value: SiteDocs[K]): Promise<CmsResult> {
    // Write locally FIRST + update cache immediately so the UI reflects right away.
    localStore.writeDoc(String(key), value);
    cmsCache.set(docKey(String(key)), { data: value, source: "local" });

    if (!firestoreClient.ready()) {
      return { ok: true };
    }

    // Fire-and-forget Firestore write — caller doesn't block.
    // On success we re-mark the cache as "firestore" so the source badge updates.
    void (async () => {
      try {
        metrics.incr("firestoreWrites");
        await firestoreClient.setDoc(DOC_PATH, String(key), value);
        cmsCache.set(docKey(String(key)), { data: value, source: "firestore" });
      } catch (e: any) {
        console.warn(`[cms] setDoc("${String(key)}") background write failed:`, e);
      }
    })();

    return { ok: true };
  },

  /** Realtime subscription for a singleton document. */
  subscribeDoc<K extends SiteDocKey>(
    key: K,
    onData: (data: SiteDocs[K] | null) => void
  ): () => void {
    if (!firestoreClient.ready()) {
      console.warn(`[cms] subscribeDoc("${String(key)}"): Firestore unavailable`);
      return () => {};
    }
    return firestoreClient.watchDoc<SiteDocs[K]>(
      DOC_PATH,
      String(key),
      (value) => {
        if (value !== null) {
          cmsCache.set(docKey(String(key)), { data: value, source: "firestore" });
          onData(value);
        }
      },
      (err) => console.warn(`[cms] subscribeDoc("${String(key)}") error:`, err)
    );
  },

  /** Force-refresh helper used by admin pages after bulk operations. */
  invalidate(key?: string) {
    cmsCache.invalidate(key);
  },
};
