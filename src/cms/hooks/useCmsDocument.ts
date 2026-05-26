/**
 * useCmsDocument — read/write a singleton CMS document with cache + optional realtime.
 *
 * Speed optimisations (Phase 2B-A1):
 *   • Synchronous cache lookup on first render (zero-flash for branding, settings, hero, …)
 *   • Default staleMs = 5 min
 *   • Stable refresh/save refs (no waterfall fetches on re-render)
 */

import { useEffect, useRef, useState } from "react";
import { cmsService } from "@/cms/services/cmsService";
import { cmsCache } from "@/cms/services/cmsCache";
import { siteDocsSeed, type SiteDocKey, type SiteDocs } from "@/cms/collections";
import type { CmsSource } from "@/cms/types";

const DEFAULT_STALE_MS = 5 * 60_000;

export interface UseCmsDocumentOptions {
  realtime?: boolean;
  staleMs?: number;
  static?: boolean;
}

export interface UseCmsDocumentResult<K extends SiteDocKey> {
  data: SiteDocs[K];
  loading: boolean;
  error: string | null;
  source: CmsSource;
  save: (value: SiteDocs[K]) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useCmsDocument<K extends SiteDocKey>(
  key: K,
  opts: UseCmsDocumentOptions = {}
): UseCmsDocumentResult<K> {
  const staleMs = opts.staleMs ?? DEFAULT_STALE_MS;
  const cached = cmsCache.getStale<{ data: SiteDocs[K]; source: CmsSource }>(`doc:${String(key)}`);

  const [data, setData] = useState<SiteDocs[K]>(cached?.data ?? siteDocsSeed[key]);
  const [source, setSource] = useState<CmsSource>(cached?.source ?? "fallback");
  const [loading, setLoading] = useState(!opts.static && !cached);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const optsRef = useRef({ staleMs, isStatic: opts.static, realtime: opts.realtime });
  optsRef.current = { staleMs, isStatic: opts.static, realtime: opts.realtime };

  const apiRef = useRef<{
    refresh: () => Promise<void>;
    save:    UseCmsDocumentResult<K>["save"];
  } | null>(null);

  if (!apiRef.current) {
    apiRef.current = {
      refresh: async () => {
        if (optsRef.current.isStatic) return;
        setError(null);
        try {
          const res = await cmsService.getDoc(key, { staleMs: optsRef.current.staleMs });
          if (!mountedRef.current) return;
          setData(res.data);
          setSource(res.source);
        } catch (e: any) {
          if (!mountedRef.current) return;
          setError(e?.message || "Failed to load");
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      },
      save: async (value) => {
        let prev: SiteDocs[K] = data;
        setData((cur) => { prev = cur; return value; });
        const res = await cmsService.setDoc(key, value);
        if (!res.ok) {
          if (mountedRef.current) setData(prev);
          return { ok: false, error: res.error };
        }
        return { ok: true };
      },
    };
  }

  useEffect(() => {
    if (opts.static) { setLoading(false); return; }
    apiRef.current!.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!opts.realtime || opts.static) return;
    const unsub = cmsService.subscribeDoc(key, (value) => {
      if (!mountedRef.current || !value) return;
      setData(value as SiteDocs[K]);
      setSource("firestore");
      setLoading(false);
    });
    return unsub;
  }, [key, opts.realtime, opts.static]);

  useEffect(() => {
    const unsub = cmsCache.subscribe(`doc:${String(key)}`, () => {
      const fresh = cmsCache.getStale<{ data: SiteDocs[K]; source: CmsSource }>(`doc:${String(key)}`);
      if (fresh && mountedRef.current) {
        setData(fresh.data);
        setSource(fresh.source);
      }
    });
    return unsub;
  }, [key]);

  return {
    data, loading, error, source,
    refresh: apiRef.current.refresh,
    save:    apiRef.current.save,
  };
}
