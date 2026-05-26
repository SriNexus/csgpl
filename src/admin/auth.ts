/**
 * Admin auth — Firebase Email+Password auth with persistent session.
 *
 * Persistence:
 *   • `browserLocalPersistence` → survives browser restarts (until logout)
 *   • Auth token is automatically attached to every Firestore + Storage call
 *
 * Demo session:
 *   • Disabled by default in production. Set localStorage.csgpl_allow_demo = "1"
 *     to enable a read-only local-fallback session for offline development.
 *   • Demo session NEVER satisfies Firebase Storage / Firestore rules — it's
 *     a UI-only convenience.
 *
 * Password reset:
 *   • `requestPasswordReset(email)` triggers Firebase's hosted reset flow.
 */

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  setPersistence, browserLocalPersistence,
  sendPasswordResetEmail, updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { diagnostics } from "@/cms/services/diagnostics";

const SESSION_KEY = "csgpl_admin";
const DEMO_FLAG_KEY = "csgpl_allow_demo";

const DEMO = {
  email: "admin@csgpl.in",
  password: "admin123",
};

function demoAllowed(): boolean {
  try { return typeof localStorage !== "undefined" && localStorage.getItem(DEMO_FLAG_KEY) === "1"; }
  catch { return false; }
}

/* Ensure persistent session is set BEFORE any sign-in attempt. */
let persistenceReady: Promise<void> | null = null;
function ensurePersistence(): Promise<void> {
  if (persistenceReady) return persistenceReady;
  if (!auth) return Promise.resolve();
  persistenceReady = setPersistence(auth, browserLocalPersistence).catch((e) => {
    diagnostics.warn("auth.persistence", "Failed to set persistence", { error: e?.message });
  });
  return persistenceReady;
}

// Kick persistence as early as possible (module load).
ensurePersistence();

export interface LoginResult {
  ok: boolean;
  error?: string;
  source?: "firebase" | "demo";
}

export const adminAuth = {
  /** Email + password sign-in (Firebase). Falls back to demo only if explicitly allowed. */
  async login(email: string, password: string): Promise<LoginResult> {
    await ensurePersistence();

    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem(SESSION_KEY, "firebase");
        diagnostics.info("auth.login", "Firebase sign-in succeeded", { email });
        return { ok: true, source: "firebase" };
      } catch (e: any) {
        diagnostics.warn("auth.login", "Firebase sign-in failed", { code: e?.code, message: e?.message });
        if (demoAllowed() && email === DEMO.email && password === DEMO.password) {
          sessionStorage.setItem(SESSION_KEY, "demo");
          return { ok: true, source: "demo" };
        }
        return { ok: false, error: friendlyAuthError(e) };
      }
    }

    if (demoAllowed() && email === DEMO.email && password === DEMO.password) {
      sessionStorage.setItem(SESSION_KEY, "demo");
      return { ok: true, source: "demo" };
    }
    return { ok: false, error: "Authentication service unavailable. Please retry shortly." };
  },

  async logout() {
    sessionStorage.removeItem(SESSION_KEY);
    if (auth) {
      try { await signOut(auth); } catch { /* ignore */ }
    }
  },

  /** Trigger Firebase's hosted password reset email. */
  async requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
    if (!auth) return { ok: false, error: "Auth not initialised" };
    try {
      await sendPasswordResetEmail(auth, email);
      diagnostics.info("auth.reset", "Password reset email sent", { email });
      return { ok: true };
    } catch (e: any) {
      diagnostics.warn("auth.reset", "Reset failed", { code: e?.code });
      return { ok: false, error: friendlyAuthError(e) };
    }
  },

  /** Update displayName on the current Firebase user. */
  async updateDisplayName(name: string): Promise<{ ok: boolean; error?: string }> {
    if (!auth?.currentUser) return { ok: false, error: "Not signed in" };
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: friendlyAuthError(e) };
    }
  },

  /** Synchronous check — true when ANY admin session marker exists. */
  hasSession(): boolean {
    if (typeof sessionStorage === "undefined") return false;
    return !!sessionStorage.getItem(SESSION_KEY);
  },

  /** True ONLY for a verified Firebase Auth user (used by Storage gating). */
  hasFirebaseSession(): boolean {
    return !!auth?.currentUser;
  },
};

/* Translate Firebase auth errors into operator-friendly messages. */
function friendlyAuthError(e: any): string {
  const code = e?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/invalid-login-credentials":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No admin account found with this email.";
    case "auth/too-many-requests":
      return "Too many sign-in attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/user-disabled":
      return "This admin account has been disabled. Contact your site owner.";
    case "auth/invalid-email":
      return "That email address is not valid.";
    case "auth/missing-password":
      return "Please enter your password.";
    default:
      return e?.message || `Authentication failed (${code || "unknown"}).`;
  }
}

/* ============================================================
   useAuth — React hook tracking Firebase Auth + session state
   ============================================================ */

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);
  const [hasSession, setHasSession] = useState(adminAuth.hasSession());
  const [ready, setReady] = useState(!auth || !!auth.currentUser);

  useEffect(() => {
    if (!auth) return;
    const off = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
      // If Firebase says signed-out but we still have a session flag, drop it.
      if (!u && sessionStorage.getItem(SESSION_KEY) === "firebase") {
        sessionStorage.removeItem(SESSION_KEY);
        setHasSession(false);
      }
    });
    return off;
  }, []);

  useEffect(() => {
    const onStorage = () => setHasSession(adminAuth.hasSession());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  const isAuthed = !!user || hasSession;
  return { user, isAuthed, ready, refresh: () => setHasSession(adminAuth.hasSession()) };
}
