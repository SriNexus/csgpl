import { cn } from "@/utils/cn";
import Eyebrow from "./Eyebrow";
import Heading from "./Heading";
import Lead from "./Lead";

type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowTone?: "brand" | "amber" | "white";
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-side slot — typically a CTA, stat card or supporting copy */
  aside?: React.ReactNode;
  /** Override for the description column (e.g. swap for an action) */
  invert?: boolean;
  className?: string;
  /** When true, description is centered (rare). Default is editorial 7/5 split. */
  align?: "split" | "stacked";
};

/**
 * SectionHeader — standardized editorial 12-col header used on every section.
 * Encapsulates:
 *   `grid lg:grid-cols-12 gap-10 items-end` + Eyebrow + Heading + Lead/aside
 *
 * Replaces 7+ duplicated header blocks across sections.
 */
export default function SectionHeader({
  eyebrow,
  eyebrowTone = "brand",
  title,
  description,
  aside,
  invert,
  className,
  align = "split",
}: SectionHeaderProps) {
  if (align === "stacked") {
    return (
      <div className={cn("text-center max-w-2xl mx-auto", className)}>
        {eyebrow && <Eyebrow tone={eyebrowTone} className="justify-center">{eyebrow}</Eyebrow>}
        <Heading className="mt-5" invert={invert}>{title}</Heading>
        {description && <Lead invert={invert} className="mt-5 mx-auto">{description}</Lead>}
      </div>
    );
  }

  return (
    <div className={cn("grid lg:grid-cols-12 gap-10 items-end", className)}>
      <div className="lg:col-span-7">
        {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
        <Heading className="mt-5" invert={invert}>{title}</Heading>
      </div>
      <div className="lg:col-span-5">
        {description && <Lead invert={invert}>{description}</Lead>}
        {aside}
      </div>
    </div>
  );
}
