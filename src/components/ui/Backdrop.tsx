import { cn } from "@/utils/cn";

/**
 * Backdrop presets — composable decorative layers for `<Section backdrop={...}>`.
 * Centralizes the visual recipes used across sections so we never duplicate
 * `absolute inset-0 bg-grid ...` blocks again.
 */

type Preset =
  | "aurora-light"   // hero — soft brand/amber glow + fine grid
  | "paper-dots"     // paper tone + dot pattern (Solutions, FAQ, Process)
  | "dark-cinematic" // dark hero — grid + noise + colored blobs
  | "soft-fade"      // simple top-to-bottom paper→white fade
  | "testimonial";   // emerald/amber gradient with light grid

export default function Backdrop({
  preset,
  className,
}: { preset: Preset; className?: string }) {
  switch (preset) {
    case "aurora-light":
      return (
        <div className={cn("absolute inset-0", className)} aria-hidden>
          <div className="absolute inset-0 bg-aurora" />
          <div className="absolute inset-0 bg-grid-fine opacity-60" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        </div>
      );

    case "paper-dots":
      return (
        <div className={cn("absolute inset-0", className)} aria-hidden>
          <div className="absolute inset-0 bg-dots opacity-40" />
          <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-brand-100 blur-3xl opacity-60" />
        </div>
      );

    case "dark-cinematic":
      return (
        <div className={cn("absolute inset-0", className)} aria-hidden>
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-brand-500/20 blur-[120px]" />
          <div className="absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-[120px]" />
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      );

    case "soft-fade":
      return (
        <div className={cn("absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent", className)} aria-hidden />
      );

    case "testimonial":
      return (
        <div className={cn("absolute inset-0", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-paper to-amber-50/40" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full bg-brand-200/40 blur-3xl" />
        </div>
      );
  }
}
