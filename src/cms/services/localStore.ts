/**
 * localStore — namespaced localStorage adapter used as the CMS fallback layer.
 *
 * Keys are namespaced as `csgpl_<collection>` so they're discoverable
 * & easy to wipe in the browser console:
 *   localStorage.removeItem("csgpl_leads");
 *
 * All operations are tolerant: a missing/corrupt entry returns an empty array.
 */

import type { CmsRecord, Id } from "../types";

const PREFIX = "csgpl_";
const key = (collection: string) => `${PREFIX}${collection}`;

function safeParse<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export const localStore = {
  /** Read all records (newest first). */
  readAll<T extends CmsRecord>(collection: string): T[] {
    if (typeof localStorage === "undefined") return [];
    return safeParse<T>(localStorage.getItem(key(collection)));
  },

  /** Write the entire collection (replaces existing). */
  writeAll<T extends CmsRecord>(collection: string, rows: T[]): void {
    if (typeof localStorage === "undefined") return;
    try { localStorage.setItem(key(collection), JSON.stringify(rows)); } catch { /* quota */ }
  },

  /** Prepend a record (assigns id + createdAt if missing). */
  insert<T extends CmsRecord>(collection: string, record: Omit<T, "id"> & Partial<Pick<T, "id">>): T {
    const list = this.readAll<T>(collection);
    const next = {
      ...record,
      id: record.id ?? `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: (record as any).createdAt ?? new Date().toISOString(),
    } as T;
    list.unshift(next);
    this.writeAll(collection, list);
    return next;
  },

  /** Update by id; returns the updated row or null if not found. */
  update<T extends CmsRecord>(collection: string, id: Id, patch: Partial<T>): T | null {
    const list = this.readAll<T>(collection);
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() } as T;
    this.writeAll(collection, list);
    return list[idx];
  },

  /** Remove by id; returns true if removed. */
  remove(collection: string, id: Id): boolean {
    const list = this.readAll<CmsRecord>(collection);
    const next = list.filter((r) => r.id !== id);
    if (next.length === list.length) return false;
    this.writeAll(collection, next);
    return true;
  },

  /** Read a singleton document keyed by `csgpl_doc_<docKey>`. */
  readDoc<T>(docKey: string): T | null {
    if (typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(`${PREFIX}doc_${docKey}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  },

  writeDoc<T>(docKey: string, value: T): void {
    if (typeof localStorage === "undefined") return;
    try { localStorage.setItem(`${PREFIX}doc_${docKey}`, JSON.stringify(value)); } catch { /* quota */ }
  },
};
