/**
 * Media resolver — single source of truth for image URL handling.
 *
 * Resolves any input (CMS string, data-URL, local id, undefined) into a
 * usable `<img src>` value. Provides:
 *   • fallback for empty/missing images
 *   • centralized place to add CDN transforms / srcset later
 *
 * Use across the app instead of raw `<img src={raw}>`.
 */

/** A 1×1 transparent PNG — used as the absolute fallback. */
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/** Curated category fallbacks — quality stock that match the brand. */
const CATEGORY_FALLBACK: Record<string, string> = {
  rooftop:     "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  residential: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  commercial:  "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  industrial:  "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  product:     "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
  generic:     TRANSPARENT_PIXEL,
};

export type MediaCategory = keyof typeof CATEGORY_FALLBACK;

export interface ResolveMediaOptions {
  /** Category used when input is empty / invalid */
  fallback?: MediaCategory;
}

/**
 * Resolve a media URL.
 *   • full URL → returned as-is
 *   • data: URL → returned as-is
 *   • empty / undefined → category fallback
 */
export function resolveMedia(input?: string | null, opts: ResolveMediaOptions = {}): string {
  const fallback = CATEGORY_FALLBACK[opts.fallback || "generic"];
  if (!input) return fallback;
  const s = String(input).trim();
  if (!s) return fallback;
  if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
    return s;
  }
  // Unknown format — bail to fallback
  return fallback;
}

/** All known category fallbacks (for admin pickers). */
export const mediaFallbacks = CATEGORY_FALLBACK;
