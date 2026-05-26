import { cn } from "@/utils/cn";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3";
  /** Visual size — decoupled from semantic tag */
  size?: "display" | "xl" | "lg" | "md";
  /** Apply ink-900 on light surfaces, white on dark. Auto by default. */
  invert?: boolean;
};

const sizeClass: Record<NonNullable<HeadingProps["size"]>, string> = {
  display: "text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] xl:text-[4.8rem] font-extrabold leading-[0.98] tracking-[-0.035em]",
  xl:      "text-4xl md:text-5xl lg:text-[3.6rem] font-extrabold tracking-[-0.03em] leading-[1.02]",
  lg:      "text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] leading-[1.05]",
  md:      "text-2xl md:text-3xl font-extrabold tracking-[-0.02em] leading-[1.1]",
};

/**
 * Heading — canonical editorial heading primitive.
 * Decouples semantic level (`as`) from visual scale (`size`).
 * Default `size="xl"` matches every section heading in the homepage.
 */
export default function Heading({
  as = "h2",
  size = "xl",
  invert = false,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        sizeClass[size],
        invert ? "text-white" : "text-ink-900",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
