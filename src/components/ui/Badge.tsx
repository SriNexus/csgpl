import { cn } from "@/utils/cn";

type BadgeTone =
  | "brand"        // light brand (default eyebrow chip)
  | "amber"        // featured / bestseller
  | "dark"         // ink/charcoal pill
  | "white"        // floating white pill on imagery
  | "outline"      // outline only
  | "glass"        // glass on dark surface
  | "glass-dark";  // dark glass on light surface

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** Wider letter-spacing chip used as section eyebrow on imagery. */
  variant?: "soft" | "loud";
  icon?: React.ReactNode;
};

const toneClass: Record<BadgeTone, string> = {
  brand:        "bg-brand-50 text-brand-700 border border-brand-100",
  amber:        "bg-amber-400 text-ink-900",
  dark:         "bg-ink-900 text-white",
  white:        "bg-white/95 text-ink-900 backdrop-blur",
  outline:      "border border-ink-900/15 text-ink-700 bg-transparent",
  glass:        "glass text-ink-900",
  "glass-dark": "glass-dark text-white",
};

/**
 * Badge — small uppercase chip used for tags, featured labels & micro-headers.
 * Replaces patterns like:
 *   `rounded-full bg-amber-400 text-ink-900 text-[10px] font-extrabold uppercase tracking-[0.18em] px-3 py-1.5`
 *   `rounded-full bg-white/95 text-brand-700 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 backdrop-blur`
 */
export default function Badge({
  tone = "brand",
  variant = "soft",
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full uppercase",
        variant === "loud"
          ? "text-[10px] font-extrabold tracking-[0.18em] px-3 py-1.5"
          : "text-[10px] font-bold tracking-[0.2em] px-3 py-1",
        toneClass[tone],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
