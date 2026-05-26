/**
 * useTheme — global light/dark theme controller.
 *
 * Behaviour:
 *   • Persists choice to localStorage (`csgpl_theme`)
 *   • Defaults to OS preference on first visit
 *   • Sets `data-theme="dark"` on <html> so every CSS variable
 *     and the [data-theme="dark"] overrides in index.css apply
 *   • Listens for OS theme changes when no explicit preference exists
 *   • Notifies subscribers across the app (multi-component sync)
 */

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "csgpl_theme";

function readStoredTheme(): Theme | null {
  if (typeof localStorage === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "light" ? v : null;
}

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

/** Apply the theme to <html> + meta theme-color + persist. */
function applyTheme(theme: Theme, explicit: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  // Hint the browser so form controls (scrollbar, autofill) follow theme
  document.documentElement.style.colorScheme = theme;

  // Update mobile browser chrome color
  const themeColor = theme === "dark" ? "#0a0f1c" : "#16a34a";
  let meta = document.head.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", themeColor);

  if (explicit && typeof localStorage !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* noop */ }
  }
}

/* Apply theme immediately on module load so first paint is correct. */
if (typeof window !== "undefined") {
  applyTheme(resolveInitialTheme(), false);
}

/* ============================================================
   Subscriber model — every useTheme() instance updates together
   ============================================================ */
type Listener = (t: Theme) => void;
const listeners = new Set<Listener>();
let current: Theme = typeof window === "undefined" ? "light" : resolveInitialTheme();

function broadcast(theme: Theme) {
  current = theme;
  listeners.forEach((l) => { try { l(theme); } catch { /* noop */ } });
}

/* Watch system preference when no explicit choice exists. */
if (typeof window !== "undefined" && window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", (e) => {
    if (readStoredTheme()) return; // user has explicit preference; ignore OS change
    const next: Theme = e.matches ? "dark" : "light";
    applyTheme(next, false);
    broadcast(next);
  });
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current);

  useEffect(() => {
    listeners.add(setTheme);
    return () => { listeners.delete(setTheme); };
  }, []);

  const set = (next: Theme) => {
    applyTheme(next, true);
    broadcast(next);
  };

  const toggle = () => set(theme === "dark" ? "light" : "dark");

  const reset = () => {
    if (typeof localStorage !== "undefined") {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    }
    const next = systemTheme();
    applyTheme(next, false);
    broadcast(next);
  };

  return { theme, setTheme: set, toggleTheme: toggle, resetTheme: reset };
}
