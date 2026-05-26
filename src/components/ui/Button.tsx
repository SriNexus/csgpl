import { cn } from "@/utils/cn";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "ghost" | "dark" | "white" | "link";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Render a circular arrow chip on the trailing edge (the editorial pill style). */
  trailingArrow?: boolean;
  /** Replace trailingArrow icon with a custom node */
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps  = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type AnchorProps  = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

type Props = ButtonProps | AnchorProps;

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost:   "btn-ghost",
  dark:    "btn-dark",
  white:   "bg-white text-ink-900 hover:bg-amber-300 transition-colors",
  link:    "arrow-link text-brand-700 hover:text-brand-800",
};

/** Sizes for pill-shaped buttons. `trailingArrow` adopts the pl-/pr-/py- pill style. */
const sizeClass = (size: Size, hasArrow: boolean) => {
  if (size === "lg") return hasArrow ? "pl-6 pr-2 py-2 text-sm" : "px-6 py-3 text-sm";
  if (size === "sm") return hasArrow ? "pl-4 pr-1.5 py-1.5 text-xs" : "px-4 py-2 text-xs";
  // md
  return hasArrow ? "pl-5 pr-2 py-2 text-sm" : "px-5 py-2.5 text-sm";
};

const arrowChipClass = (variant: Variant) =>
  cn(
    "grid place-items-center rounded-full",
    variant === "primary" || variant === "dark"
      ? "bg-white/15 text-white backdrop-blur"
      : "bg-ink-900 text-white",
    "h-9 w-9"
  );

/**
 * Button — canonical CTA primitive.
 * Replaces 9+ repetitions of `btn-primary rounded-full pl-X pr-Y py-Z ...`.
 * Supports button OR anchor via `as="a"`.
 */
export default function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    trailingArrow = false,
    trailing,
    leading,
    className,
    children,
    ...rest
  } = props as CommonProps & Record<string, any>;

  const isLink = variant === "link";
  const hasArrow = trailingArrow && !isLink;

  const baseShape = isLink
    ? "inline-flex items-center gap-2 font-bold"
    : cn(
        "inline-flex items-center gap-3 rounded-full font-semibold no-tap whitespace-nowrap",
        sizeClass(size, hasArrow)
      );

  const content = (
    <>
      {leading}
      <span className={isLink ? "" : "inline-flex items-center gap-2"}>{children}</span>
      {trailing
        ? trailing
        : hasArrow
          ? <span className={arrowChipClass(variant)}><ArrowRight className="h-4 w-4" /></span>
          : null}
    </>
  );

  if ((props as AnchorProps).as === "a") {
    const { as: _a, ...anchorRest } = rest;
    return (
      <a className={cn(baseShape, variantClass[variant], className)} {...(anchorRest as any)}>
        {content}
      </a>
    );
  }
  const { as: _b, ...btnRest } = rest;
  return (
    <button className={cn(baseShape, variantClass[variant], className)} {...(btnRest as any)}>
      {content}
    </button>
  );
}
