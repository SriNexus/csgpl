/**
 * useCmsCollection — primary hook for reading & mutating a CMS collection.
 *
 * Speed optimisations (Phase 2B-A1):
 *   • Synchronous cache lookup on first render (no flash, no waterfall)
 *   • Default staleMs raised to 5 min (admin pages were re-fetching every visit)
 *   • Stable refresh/create/update/remove via inline cmsService import (no useCallback deps)
 *   • setLoading(false) immediately when cached data is returned synchronously
 */

import { useEffect, useRef, useState } from "react";
import { cmsService } from "@/cms/services/cmsService";
import { cmsCache } from "@/cms/services/cmsCache";
import { cmsCollections, type CollectionKey } from "@/cms/collections";
import type { CmsRecord, CmsSource, Id } from "@/cms/types";

const DEFAULT_STALE_MS = 5 * 60_000; // 5 minutes

export interface UseCmsCollectionOptions {
  realtime?: boolean;
  staleMs?: number;
  static?: boolean;
}

export interface UseCmsCollectionResult<T extends CmsRecord> {
  data: T[];
  loading: boolean;
  error: string | null;
  source: CmsSource;
  refresh: () => Promise<void>;
  create: (payload: Omit<T, "id">) => Promise<{ ok: boolean; error?: string }>;
  update: (id: Id, patch: Partial<T>) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: Id) => Promise<{ ok: boolean; error?: string }>;
}

export function useCmsCollection<T extends CmsRecord>(
  key: CollectionKey,
  opts: UseCmsCollectionOptions = {}
): UseCmsCollectionResult<T> {
  const def = cmsCollections[key];
  const seed = def.seed as unknown as T[];
  const staleMs = opts.staleMs ?? DEFAULT_STALE_MS;

  // Synchronous cache lookup → first paint shows cached data instantly
  const cached = cmsCache.getStale<{ data: T[]; source: CmsSource }>(`col:${def.key}`);

  const [data, setData]     = useState<T[]>(cached?.data ?? seed);
  const [source, setSource] = useState<CmsSource>(cached?.source ?? "fallback");
  // If we already have cached data, render with loading=false to avoid spinner flash
  const [loading, setLoading] = useState(!opts.static && !cached);
  const [error, setError]   = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // Stable refs to options so we don't refetch on parent re-render
  const optsRef = useRef({ staleMs, isStatic: opts.static, realtime: opts.realtime });
  optsRef.current = { staleMs, isStatic: opts.static, realtime: opts.realtime };

  /* refresh & mutations are stable (do not change on re-render) */
  const apiRef = useRef<{
    refresh: () => Promise<void>;
    create:  UseCmsCollectionResult<T>["create"];
    update:  UseCmsCollectionResult<T>["update"];
    remove:  UseCmsCollectionResult<T>["remove"];
  } | null>(null);

  if (!apiRef.current) {
    apiRef.current = {
      refresh: async () => {
        if (optsRef.current.isStatic) return;
        setError(null);
        try {
          const res = await cmsService.list(key, { staleMs: optsRef.current.staleMs });
          if (!mountedRef.current) return;
          setData(res.data as T[]);
          setSource(res.source);
        } catch (e: any) {
          if (!mountedRef.current) return;
          setError(e?.message || "Failed to load");
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      },
      create: async (payload) => {
        const tmpId = `tmp-${Date.now()}`;
        const optimistic = { ...(payload as object), id: tmpId } as T;
        setData((cur) => [optimistic, ...cur]);
        const res = await cmsService.create<T>(key, payload as any);
        if (!res.ok) {
          if (mountedRef.current) setData((cur) => cur.filter((r) => r.id !== tmpId));
          return { ok: false, error: res.error };
        }
        if (mountedRef.current) setData((cur) => cur.map((r) => (r.id === tmpId ? (res.data as T) : r)));
        return { ok: true };
      },
      update: async (id, patch) => {
        let prev: T[] = [];
        setData((cur) => { prev = cur; return cur.map((r) => (r.id === id ? ({ ...r, ...patch } as T) : r)); });
        const res = await cmsService.update<T>(key, id, patch);
        if (!res.ok) { if (mountedRef.current) setData(prev); return { ok: false, error: res.error }; }
        return { ok: true };
      },
      remove: async (id) => {
        let prev: T[] = [];
        setData((cur) => { prev = cur; return cur.filter((r) => r.id !== id); });
        const res = await cmsService.remove(key, id);
        if (!res.ok) { if (mountedRef.current) setData(prev); return { ok: false, error: res.error }; }
        return { ok: true };
      },
    };
  }

  /* Initial fetch (background — UI already painted from cache/seed) */
  useEffect(() => {
    if (opts.static) { setLoading(false); return; }
    apiRef.current!.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /* Realtime subscription (opt-in) */
  useEffect(() => {
    if (!opts.realtime || opts.static) return;
    const unsub = cmsService.subscribeCollection(key, (rows) => {
      if (!mountedRef.current) return;
      setData(rows as T[]);
      setSource("firestore");
      setLoading(false);
    });
    return unsub;
  }, [key, opts.realtime, opts.static]);

  /* Subscribe to cache invalidations so mutations elsewhere refresh this view */
  useEffect(() => {
    const unsub = cmsCache.subscribe(`col:${def.key}`, () => {
      const fresh = cmsCache.getStale<{ data: T[]; source: CmsSource }>(`col:${def.key}`);
      if (fresh && mountedRef.current) {
        setData(fresh.data);
        setSource(fresh.source);
      }
    });
    return unsub;
  }, [def.key]);

  return {
    data, loading, error, source,
    refresh: apiRef.current.refresh,
    create:  apiRef.current.create,
    update:  apiRef.current.update,
    remove:  apiRef.current.remove,
  };
}
