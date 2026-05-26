/**
 * Motion presets — class string helpers for reveal/hover/timing.
 * All animations are CSS-driven (defined in index.css under animations layer)
 * so no JS animation library is required at runtime.
 */

export const motion = {
  // entrance
  fadeUp:        "animate-fade-up",
  floatSlow:     "animate-float-slow",
  pulseGlow:     "animate-pulse-glow",
  marquee:       "animate-marquee",

  // group-level stagger (children fade up sequentially via CSS)
  stagger:       "stagger",

  // image hover (paired with `group` on parent + `img-zoom` on child)
  imageZoomHost: "group",
  imageZoom:     "img-zoom",
  imageCinematic:"img-cinematic",
  imageDuotone:  "img-duotone",
} as const;

/**
 * Per-element animation delay helper (max 8 stable steps).
 * Use when stagger CSS isn't appropriate (e.g. distant siblings).
 */
export const delay = (step: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) =>
  ({ animationDelay: `${0.05 + step * 0.1}s` } as React.CSSProperties);
