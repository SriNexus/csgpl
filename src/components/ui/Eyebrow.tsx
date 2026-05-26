import { cn } from "@/utils/cn";

type EyebrowProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Color of the leading rule. Defaults to brand. */
  tone?: "brand" | "amber" | "white";
};

const ruleClass: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "bg-brand-600",
  amber: "bg-amber-500",
  white: "bg-brand-300",
};

const labelClass: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "text-brand-600",
  amber: "text-amber-700",
  white: "text-brand-300",
};

/**
 * Eyebrow — small uppercase rule-prefixed label used above every section heading.
 * Replaces the repeated `<div className="eyebrow flex items-center gap-3">…</div>` pattern.
 */
export default function Eyebrow({ tone = "brand", className, children, ...rest }: EyebrowProps) {
  return (
    <div className={cn("eyebrow flex items-center gap-3", labelClass[tone], className)} {...rest}>
      <span className={cn("h-px w-8", ruleClass[tone])} />
      {children}
    </div>
  );
}
