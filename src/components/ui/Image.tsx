/**
 * Image — canonical image primitive.
 *
 * Phase 2B-A upgrades:
 *   • Robust broken-image recovery (single retry on error → category fallback)
 *   • Aspect-ratio reservation via `width × height` OR explicit `ratio` prop
 *     → prevents Cumulative Layout Shift
 *   • Optional WebP `<picture>` source when `webpSrc` is supplied
 *   • Strict resolveMedia integration (handles CMS strings, data URLs, empty)
 *   • `priority` opt-in for above-the-fold images (eager + fetchpriority=high)
 *   • async decoding (free CPU win)
 *
 * Drop-in for `<img>` everywhere.
 */

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { resolveMedia, type MediaCategory } from "@/cms/media";

export interface ImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "loading" | "decoding"
> {
  /** Raw URL (Firebase, data:, http, /local) — resolved via `resolveMedia`. */
  src?: string | null;
  /** Required alt text — pass "" for purely decorative images. */
  alt: string;
  /** Optional WebP variant; rendered via `<picture>` when provided. */
  webpSrc?: string;
  /** Category fallback when `src` is empty / broken. */
  fallback?: MediaCategory;
  /** Mark above-the-fold images for eager loading + high fetch priority. */
  priority?: boolean;
  /** Numeric width × height — reserves layout space (CLS prevention). */
  width?: number;
  height?: number;
  /** Convenience aspect-ratio reservation when width/height aren't known. */
  ratio?: number;
  /** Native sizes/srcset passthrough (kept for future CDN integration). */
  sizes?: string;
  /** Optional explicit className for the inner <img> tag inside <picture>. */
  imgClassName?: string;
}

export default function Image({
  src,
  webpSrc,
  alt,
  fallback = "generic",
  priority = false,
  className,
  imgClassName,
  width,
  height,
  ratio,
  sizes,
  style,
  onError,
  ...rest
}: ImageProps) {
  const initial = resolveMedia(src, { fallback });
  const [current, setCurrent] = useState<string>(initial);
  const [errored, setErrored] = useState(false);

  // Re-sync if the upstream `src` changes (e.g. CMS hydration arrives).
  useEffect(() => {
    const resolved = resolveMedia(src, { fallback });
    setCurrent(resolved);
    setErrored(false);
  }, [src, fallback]);

  /** Reserve layout space to prevent CLS without forcing a fixed pixel size. */
  const reservedStyle: React.CSSProperties = (() => {
    if (ratio && !width && !height) {
      return { aspectRatio: String(ratio), ...style };
    }
    if (width && height) {
      return { aspectRatio: `${width} / ${height}`, ...style };
    }
    return style ?? {};
  })();

  const sharedImgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    ...rest,
    src: current,
    alt,
    width,
    height,
    sizes,
    style: reservedStyle,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
    onError: (e) => {
      if (!errored) {
        setErrored(true);
        // Swap to the category fallback exactly once
        setCurrent(resolveMedia(undefined, { fallback }));
      }
      onError?.(e);
    },
    className: cn(imgClassName ?? className),
    // `fetchpriority` is React-19-passthrough for modern browsers
    ...(priority ? { fetchpriority: "high" as any } : {}),
  };

  // <picture> with WebP source when provided + non-empty (and not yet errored).
  if (webpSrc && !errored) {
    return (
      <picture className={className}>
        <source srcSet={webpSrc} type="image/webp" />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...sharedImgProps} />
      </picture>
    );
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...sharedImgProps} />;
}
