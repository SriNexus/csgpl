/**
 * Runtime configuration — single source of truth for environment-driven
 * values used at runtime. Built so the same bundle can be deployed across
 * environments by injecting overrides via:
 *   • Vite env vars (build-time)         → `import.meta.env.VITE_*`
 *   • Global window object (runtime)     → `window.__CSGPL_CONFIG__`
 *
 * The window-injection path lets ops change values (e.g. siteUrl) without
 * rebuilding — e.g. by inlining a `<script>` in `index.html` per environment.
 */

export interface RuntimeConfig {
  /** Public site URL, used for canonical/OG/sitemap (no trailing slash). */
  siteUrl: string;
  /** Build mode label — surfaced in admin Settings. */
  mode: "development" | "production" | "preview";
  /** Whether Firebase is expected to be reachable. */
  firebaseEnabled: boolean;
}

/* Build-time defaults from Vite env. Any missing value falls back to a sane default. */
const env = (typeof import.meta !== "undefined" ? (import.meta as any).env : {}) || {};

const DEFAULTS: RuntimeConfig = {
  siteUrl: env.VITE_SITE_URL || "https://csgpl.in",
  mode:    env.DEV ? "development" : env.MODE === "preview" ? "preview" : "production",
  firebaseEnabled: env.VITE_FIREBASE_ENABLED !== "false",
};

/* Runtime overrides via window (optional). */
function readWindowOverrides(): Partial<RuntimeConfig> {
  if (typeof window === "undefined") return {};
  const w = (window as any).__CSGPL_CONFIG__;
  return (w && typeof w === "object") ? w : {};
}

let cached: RuntimeConfig | null = null;
export function getRuntimeConfig(): RuntimeConfig {
  if (cached) return cached;
  cached = { ...DEFAULTS, ...readWindowOverrides() };
  return cached;
}

/** Build an absolute URL for a path on the public site (used by SEO / sitemap). */
export function absoluteUrl(path: string): string {
  const base = getRuntimeConfig().siteUrl.replace(/\/+$/, "");
  if (!path) return base;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
