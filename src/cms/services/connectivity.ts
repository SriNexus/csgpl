/**
 * connectivity — lightweight Firebase + browser network watchdog.
 *
 * Exposes a single `connectivity.status()` snapshot + subscription mechanism.
 * Used by:
 *   • Global toast banner when network drops
 *   • Storage debug page
 *   • Pre-flight check before uploads (to fail fast on offline)
 */

import { diagnostics } from "./diagnostics";

export type ConnectivityStatus = "online" | "offline" | "degraded";

interface State {
  online: boolean;
  lastFirebaseError?: string;
  lastFirebaseErrorAt?: number;
}

const state: State = {
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
};

type Listener = (s: ConnectivityStatus) => void;
const listeners = new Set<Listener>();

function notify() {
  const s = computeStatus();
  listeners.forEach((l) => { try { l(s); } catch { /* noop */ } });
}

function computeStatus(): ConnectivityStatus {
  if (!state.online) return "offline";
  if (state.lastFirebaseErrorAt && Date.now() - state.lastFirebaseErrorAt < 30_000) return "degraded";
  return "online";
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    state.online = true;
    diagnostics.info("connectivity", "Network back online");
    notify();
  });
  window.addEventListener("offline", () => {
    state.online = false;
    diagnostics.warn("connectivity", "Network offline");
    notify();
  });
}

export const connectivity = {
  status(): ConnectivityStatus { return computeStatus(); },
  isOnline(): boolean { return state.online; },
  recordFirebaseError(message: string) {
    state.lastFirebaseError = message;
    state.lastFirebaseErrorAt = Date.now();
    notify();
  },
  clearFirebaseError() {
    state.lastFirebaseError = undefined;
    state.lastFirebaseErrorAt = undefined;
    notify();
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    l(computeStatus());
    return () => { listeners.delete(l); };
  },
};
