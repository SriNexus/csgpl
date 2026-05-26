/**
 * Logo — pure presentation. Strictly prop-driven.
 *
 *   <Logo src={branding.logoLight} variant="full" />
 *
 * Behaviour when `src` is empty:
 *   • Renders a neutral skeleton tile sized to the className boundary.
 *   • Never falls back to inline SVG, base-64 strings, or company-name text.
 *   • Logs a single warn-level diagnostic per missing slot per session so
 *     admins know to upload the asset (visible in /admin/debug/storage).
 *
 * Sizing:
 *   The parent controls width via className. The image element fills it with
 *   `object-contain` so any aspect ratio renders correctly.
 */

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { diagnostics } from "@/cms/services/diagnostics";

export interface LogoProps {
  /** URL of the uploaded logo asset. */
  src?: string;
  /** Accessible label. */
  alt?: string;
  /** Tailwind sizing applied to the wrapper. */
  className?: string;
  /** Visual variant — informs default sizing & a11y label only. */
  variant?: "full" | "collapsed";
  /** Diagnostic slot name (e.g. "logoLight"). Used for the missing-asset warning. */
  slot?: string;
}

export default function Logo({
  src,
  alt = "ChaitanyaSri Greentech",
  className,
  variant = "full",
  slot,
}: LogoProps) {
  const warnedRef = useRef(false);

  // Diagnostic for missing logo (logged once per slot per session)
  useEffect(() => {
    if (src || warnedRef.current) return;
    warnedRef.current = true;
    diagnostics.warn(
      "branding.logo.missing",
      `No logo configured for slot "${slot ?? variant}". Upload one at /admin/branding.`,
    );
  }, [src, slot, variant]);

  const sizingClass = className ?? (variant === "collapsed" ? "h-10 w-10" : "h-10");

  if (!src) {
    return (
      <span
        aria-label={`${alt} (logo not configured)`}
        role="img"
        className={cn(
          sizingClass,
          "inline-block rounded-md bg-gray-200/70 border border-gray-200",
          "relative overflow-hidden",
          // soft shimmer to make the missing state obvious without being loud
          "before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
          "before:animate-[shimmer_2s_infinite]",
        )}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizingClass, "w-auto object-contain")}
      loading="eager"
      decoding="async"
    />
  );
}
