import { cn } from "@/utils/cn";

type CardSurface = "white" | "paper" | "dark" | "glass" | "glass-dark";
type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  surface?: CardSurface;
  padding?: CardPadding;
  /** Apply premium hover lift transition */
  interactive?: boolean;
  /** Override default radius */
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl";
};

const surfaceClass: Record<CardSurface, string> = {
  white:        "bg-white border border-ink-900/[0.06]",
  paper:        "bg-paper border border-ink-900/[0.06]",
  dark:         "bg-ink-900 text-white border border-white/[0.08]",
  glass:        "glass",
  "glass-dark": "glass-dark text-white",
};

const paddingClass: Record<CardPadding, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-5 sm:p-6",
  lg:   "p-6 sm:p-7",
  xl:   "p-7 sm:p-9",
};

const radiusClass = {
  md:  "rounded-xl",
  lg:  "rounded-2xl",
  xl:  "rounded-[1.5rem]",
  "2xl": "rounded-[1.75rem]",
  "3xl": "rounded-[2rem]",
} as const;

/**
 * Card — canonical surface primitive.
 * Encapsulates surface + padding + radius + optional hover.
 * Replaces dozens of ad-hoc `rounded-2xl bg-white border hairline ...` repetitions.
 */
export default function Card({
  surface = "white",
  padding = "lg",
  interactive = false,
  radius = "lg",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        radiusClass[radius],
        surfaceClass[surface],
        paddingClass[padding],
        interactive && "card-hover",
        "relative",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
