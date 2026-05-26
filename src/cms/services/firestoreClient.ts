/**
 * firestoreClient — thin wrapper around `firebase/firestore` for the CMS service.
 * Centralizes:
 *   • collection() / doc() resolution
 *   • timestamp normalization
 *   • realtime subscriptions
 *
 * Avoids leaking Firebase SDK types upward — UI/hooks consume normalized JSON.
 */

import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  setDoc, query, orderBy, onSnapshot, serverTimestamp,
  type DocumentData, type QueryConstraint, type Unsubscribe,
} from "firebase/firestore";
import { db, firebaseReady } from "@/lib/firebase";
import type { CmsRecord, Id } from "../types";

/** Normalize a Firestore document snapshot into a plain CmsRecord. */
function normalize<T extends CmsRecord>(id: string, data: DocumentData): T {
  const out: any = { ...data, id };
  for (const k of ["createdAt", "updatedAt"]) {
    const v = out[k];
    if (v && typeof v === "object" && typeof v.toDate === "function") {
      out[k] = v.toDate().toISOString();
    }
  }
  return out as T;
}

export const firestoreClient = {
  ready: firebaseReady,

  async list<T extends CmsRecord>(collectionPath: string, orderByField?: string): Promise<T[]> {
    if (!db) throw new Error("Firestore not initialized");
    const constraints: QueryConstraint[] = orderByField ? [orderBy(orderByField, "desc")] : [];
    const q = query(collection(db, collectionPath), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalize<T>(d.id, d.data()));
  },

  async getDoc<T>(path: string, id: string): Promise<T | null> {
    if (!db) throw new Error("Firestore not initialized");
    const snap = await getDoc(doc(db, path, id));
    if (!snap.exists()) return null;
    return normalize<any>(snap.id, snap.data()) as T;
  },

  async create<T extends CmsRecord>(collectionPath: string, payload: Omit<T, "id">): Promise<T> {
    if (!db) throw new Error("Firestore not initialized");
    const ref = await addDoc(collection(db, collectionPath), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { ...(payload as object), id: ref.id, createdAt: new Date().toISOString() } as T;
  },

  async update<T extends CmsRecord>(collectionPath: string, id: Id, patch: Partial<T>): Promise<Partial<T> & { id: Id }> {
    if (!db) throw new Error("Firestore not initialized");
    await updateDoc(doc(db, collectionPath, id), { ...patch, updatedAt: serverTimestamp() } as any);
    return { ...patch, id };
  },

  async remove(collectionPath: string, id: Id): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, collectionPath, id));
  },

  async setDoc<T>(path: string, id: string, value: T): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    await setDoc(doc(db, path, id), { ...(value as object), updatedAt: serverTimestamp() } as any, { merge: true });
  },

  /**
   * Subscribe to a collection in realtime. Returns an unsubscribe fn.
   * Callback receives normalized records (sorted by createdAt desc when specified).
   */
  watchCollection<T extends CmsRecord>(
    collectionPath: string,
    orderByField: string | undefined,
    onData: (rows: T[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    if (!db) {
      onError?.(new Error("Firestore not initialized"));
      return () => {};
    }
    const constraints: QueryConstraint[] = orderByField ? [orderBy(orderByField, "desc")] : [];
    const q = query(collection(db, collectionPath), ...constraints);
    return onSnapshot(
      q,
      (snap) => onData(snap.docs.map((d) => normalize<T>(d.id, d.data()))),
      (err) => onError?.(err)
    );
  },

  /** Subscribe to a single document. Returns an unsubscribe fn. */
  watchDoc<T>(
    path: string,
    id: string,
    onData: (value: T | null) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    if (!db) {
      onError?.(new Error("Firestore not initialized"));
      return () => {};
    }
    return onSnapshot(
      doc(db, path, id),
      (snap) => onData(snap.exists() ? (normalize<any>(snap.id, snap.data()) as T) : null),
      (err) => onError?.(err)
    );
  },
};
