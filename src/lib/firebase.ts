/**
 * Firebase root — SDK initialisation + runtime validation.
 *
 * Why so much code for "just init"?
 *   • Misconfigured `storageBucket` is the #1 silent-failure cause for uploads.
 *   • Browser-side `getStorage(app)` without an explicit bucket URL falls back
 *     to `gs://<projectId>.appspot.com` — which doesn't exist for projects
 *     created after Apr 2024 (the new default is `<projectId>.firebasestorage.app`).
 *   • We surface every init issue through `firebaseStatus` so the admin
 *     `/admin/debug/storage` page can show actionable diagnostics.
 */

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { diagnostics } from "@/cms/services/diagnostics";

/* ============================================================
   CONFIG (do not move values into env without verifying)
   ============================================================ */
const firebaseConfig = {
  apiKey:            "AIzaSyBdJoKs15Ek52gvLBEaKoVrF6VdVz1wLV8",
  authDomain:        "csgpl-83618.firebaseapp.com",
  projectId:         "csgpl-83618",
  // Use the EXPLICIT bucket URL ("gs://…") so the SDK never falls back to
  // the legacy `<projectId>.appspot.com` default. This is the single most
  // common cause of "uploads silently fail" in newer Firebase projects.
  storageBucket:     "csgpl-83618.firebasestorage.app",
  messagingSenderId: "622114322607",
  appId:             "1:622114322607:web:29be343b840568bc647c5a",
  measurementId:     "G-Q99YFZS3H7",
};

/* ============================================================
   STATE
   ============================================================ */
export interface FirebaseStatus {
  initialized:  boolean;
  appOk:        boolean;
  firestoreOk:  boolean;
  authOk:       boolean;
  storageOk:    boolean;
  bucket:       string | null;
  errors:       { scope: string; message: string }[];
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

const status: FirebaseStatus = {
  initialized: false,
  appOk: false, firestoreOk: false, authOk: false, storageOk: false,
  bucket: null,
  errors: [],
};

/* ============================================================
   INITIALISATION (each step isolated so partial init still works)
   ============================================================ */
function pushErr(scope: string, e: unknown) {
  const message = (e as any)?.message || String(e);
  status.errors.push({ scope, message });
  diagnostics.error(`firebase.init.${scope}`, message, e);
}

try {
  app = initializeApp(firebaseConfig);
  status.appOk = true;
} catch (e) { pushErr("app", e); }

if (app) {
  try { db = getFirestore(app); status.firestoreOk = true; }
  catch (e) { pushErr("firestore", e); }

  try { auth = getAuth(app); status.authOk = true; }
  catch (e) { pushErr("auth", e); }

  try {
    // EXPLICIT bucket URL — bypasses the appspot.com default.
    storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
    status.bucket = firebaseConfig.storageBucket;
    status.storageOk = true;
  } catch (e) { pushErr("storage", e); }
}

status.initialized = status.appOk && status.firestoreOk;

if (status.initialized) {
  diagnostics.info("firebase.init", "Firebase initialised", {
    bucket:    status.bucket,
    storageOk: status.storageOk,
    authOk:    status.authOk,
  });
} else {
  diagnostics.warn("firebase.init", "Firebase not fully initialised — falling back to local mode", status.errors);
}

/* ============================================================
   EXPORTS
   ============================================================ */
export { app, db, auth, storage };

/** True when the core Firestore stack is ready. */
export const firebaseReady = () => status.initialized && !!db;

/** True when Storage upload should be attempted. */
export const storageReady = () => status.storageOk && !!storage;

/** Snapshot of init state (admin debug page reads this). */
export function getFirebaseStatus(): FirebaseStatus {
  return { ...status, errors: status.errors.slice() };
}

/** Public config readback for the diagnostic page. Never expose secrets. */
export function getFirebasePublicConfig() {
  return {
    projectId:     firebaseConfig.projectId,
    authDomain:    firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
  };
}
