import { cn } from "@/utils/cn";
import { sectionPadding, type SectionPaddingKey } from "@/design/tokens";
import Container from "./Container";

type Tone = "white" | "paper" | "dark" | "transparent";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** vertical padding scale — `lg` (default) matches the standardized section rhythm */
  padding?: SectionPaddingKey;
  /** background tone — abstracts repeated section background patterns */
  tone?: Tone;
  /** optional decorative backdrop layer rendered behind content */
  backdrop?: React.ReactNode;
  /** when true, wraps `children` in a `<Container>` automatically */
  contained?: boolean;
  /** container size when `contained` */
  containerSize?: "base" | "narrow" | "prose";
};

/**
 * tone styling.
 *
 * Uses bespoke utility classes (defined in index.css's component layer)
 * that resolve to the correct page-level surface in each theme. The
 * `dark` tone uses RAW hex because those sections are intentionally
 * dark in BOTH themes (footer, hero strips, dark CTA banners).
 */
const toneClass: Record<Tone, string> = {
  white:       "section-surface-white",
  paper:       "section-surface-paper",
  dark:        "bg-[#050912] text-white",
  transparent: "",
};

/**
 * Section — canonical page section primitive.
 * Standardizes:
 *   • vertical padding rhythm
 *   • background tone (white / paper / dark)
 *   • optional decorative backdrop layer
 *   • optional auto-Container wrapping
 *
 * Replaces 9+ duplicated `<section className="py-24 md:py-32 bg-...">` patterns.
 */
export default function Section({
  padding = "lg",
  tone = "white",
  backdrop,
  contained = true,
  containerSize = "base",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        sectionPadding[padding],
        toneClass[tone],
        className
      )}
      {...rest}
    >
      {backdrop ? <div className="pointer-events-none absolute inset-0">{backdrop}</div> : null}
      {contained ? (
        <Container size={containerSize} className="relative">
          {children}
        </Container>
      ) : (
        children
      )}
    </section>
  );
}
