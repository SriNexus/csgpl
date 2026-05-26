/**
 * Lead submission — kept as a thin wrapper around the CMS service
 * so the existing import surface (`@/lib/firebase`) stays backward-compatible.
 */
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { localStore } from "@/cms/services/localStore";
import type { LeadRecord } from "@/cms/collections";

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  city: string;
  systemType: string;
  monthlyBill: string;
  source?: string;
};

export async function submitLead(
  payload: LeadPayload
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    if (!db) throw new Error("Firestore not initialized");
    const ref = await addDoc(collection(db, "leads"), {
      ...payload,
      createdAt: serverTimestamp(),
      status: "new",
    });
    return { ok: true, id: ref.id };
  } catch (e: any) {
    // Fallback: mirror into local-store so admin can still see leads
    localStore.insert<LeadRecord>("leads", {
      ...payload,
      createdAt: new Date().toISOString(),
      status: "new",
    });
    return { ok: false, error: e?.message || "Failed to submit" };
  }
}
