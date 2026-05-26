/**
 * Design Tokens — single source of truth for layout primitives.
 * Color tokens live in index.css (@theme) and are consumed via Tailwind utilities.
 * These tokens cover spacing, sizing, motion & elevation patterns reused across sections.
 */

// ----- Container / Layout -----
export const container = {
  // Standard page container used by every section (Section primitive)
  base: "mx-auto max-w-7xl px-4 sm:px-6",
  narrow: "mx-auto max-w-5xl px-4 sm:px-6",
  prose: "mx-auto max-w-3xl px-4 sm:px-6",
} as const;

// ----- Section padding scale (tightened for enterprise rhythm) -----
export const sectionPadding = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-24", // default — premium without being airy
  xl: "py-24 md:py-32",
} as const;
export type SectionPaddingKey = keyof typeof sectionPadding;

// ----- Editorial 12-col header grid -----
export const editorialHeader = "grid lg:grid-cols-12 gap-10 items-end";

// ----- Motion / easing -----
export const easing = {
  premium: "cubic-bezier(.2,.7,.2,1)",
} as const;

// ----- Z-index scale -----
export const z = {
  base: 0,
  raised: 10,
  sticky: 30,
  nav: 50,
  floating: 40,
  modal: 60,
} as const;

// ----- Image quality presets (Pexels CDN sizing) -----
export const img = {
  hero:     "?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900",
  feature:  "?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  card:     "?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
  thumb:    "?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
} as const;
