/**
 * CMS type system.
 * All collection records share `id` + timestamp metadata.
 * Concrete record types live in `src/cms/collections.ts`.
 */

export type Id = string;

export type CmsTimestamp = string | number; // serialised ISO or epoch ms

export interface CmsRecord {
  id: Id;
  createdAt?: CmsTimestamp;
  updatedAt?: CmsTimestamp;
}

/** State envelope returned by every CMS hook. */
export interface CmsState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  /** "firestore" | "local" — tells the UI which data path served the response. */
  source: CmsSource;
}

export interface CmsDocState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  source: CmsSource;
}

export type CmsSource = "firestore" | "local" | "fallback";

/** Generic write result envelope. */
export interface CmsResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
