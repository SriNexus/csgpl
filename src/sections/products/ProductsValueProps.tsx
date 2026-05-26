/**
 * ProductsValueProps — "Why choose our portfolio" 5-up grid.
 */

import { Section, SectionHeader, Card } from "@/components/ui";
import { portfolioValueProps } from "@/data/productsCatalog";

export default function ProductsValueProps() {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Why our portfolio"
        title={
          <>
            Engineered for <span className="text-gradient-brand">project-grade reliability.</span>
          </>
        }
        description="Built around real EPC requirements — from product compatibility to commissioning support."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {portfolioValueProps.map((v) => {
          const Icon = v.icon;
          return (
            <Card key={v.title} interactive padding="lg">
              <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{v.desc}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
