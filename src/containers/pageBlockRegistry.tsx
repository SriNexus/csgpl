/**
 * pageBlockRegistry — declarative mapping of `PageSectionBlock.kind`
 * to a renderer function. Mirrors the homepage `sectionRegistry` pattern.
 *
 * To support a new block kind:
 *   1. Extend `PageSectionBlock` in src/cms/collections.ts
 *   2. Add a renderer here
 *   3. (Optional) add an admin editor in PageEditorView
 */

import { Section, Container, SectionHeader, Button, Image, Card } from "@/components/ui";
import { renderMarkdown } from "@/utils/content";
import type { PageSectionBlock } from "@/cms/collections";

export const pageBlockRegistry: Record<PageSectionBlock["kind"], (b: any) => React.ReactNode> = {
  hero:     (b) => <PageHeroBlock     {...b} />,
  richText: (b) => <PageRichTextBlock {...b} />,
  image:    (b) => <PageImageBlock    {...b} />,
  cta:      (b) => <PageCtaBlock      {...b} />,
};

/* ---------- block renderers (presentation only) ---------- */

function PageHeroBlock({
  eyebrow, title, description, image,
}: { eyebrow?: string; title: string; description?: string; image?: string }) {
  return (
    <Section tone="paper" padding="lg" className="pt-32 md:pt-36">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <SectionHeader
            eyebrow={eyebrow || ""}
            title={title}
            description={description}
          />
        </div>
        {image && (
          <div className="lg:col-span-5">
            <div className="rounded-[1.75rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5">
              <Image src={image} alt={title} fallback="rooftop" priority className="w-full aspect-[4/3] object-cover" />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function PageRichTextBlock({ markdown }: { markdown: string }) {
  const html = renderMarkdown(markdown || "");
  return (
    <Section tone="white" padding="md">
      <Container size="prose">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Section>
  );
}

function PageImageBlock({ src, alt, caption }: { src: string; alt?: string; caption?: string }) {
  return (
    <Section tone="white" padding="sm">
      <Container size="prose">
        <figure>
          <div className="rounded-[1.5rem] overflow-hidden shadow-soft">
            <Image src={src} alt={alt || ""} className="w-full object-cover" />
          </div>
          {caption && <figcaption className="mt-3 text-center text-xs text-ink-500 italic">{caption}</figcaption>}
        </figure>
      </Container>
    </Section>
  );
}

function PageCtaBlock({
  title, description, buttonLabel, buttonHref,
}: { title: string; description?: string; buttonLabel: string; buttonHref: string }) {
  return (
    <Section tone="paper" padding="md">
      <Card surface="dark" radius="2xl" padding="xl" className="overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h3>
            {description && <p className="mt-3 text-white/70">{description}</p>}
          </div>
          <Button as="a" href={buttonHref} variant="white" size="lg" trailingArrow>
            {buttonLabel}
          </Button>
        </div>
      </Card>
    </Section>
  );
}
