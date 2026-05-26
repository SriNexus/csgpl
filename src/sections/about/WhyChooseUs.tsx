/**
 * WhyChooseUs — 6 premium pillar cards explaining the CSGPL value system.
 */

import { Section, SectionHeader, Card } from "@/components/ui";
import { whyChooseUs } from "@/data/aboutContent";

export default function WhyChooseUs() {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Why Customers Choose Us"
        title={
          <>
            <span className="serif font-normal text-ink-600">Engineered for</span>{" "}
            <span className="text-gradient-brand">25-year confidence.</span>
          </>
        }
        description="Six commitments we hold ourselves to — they're why our customers refer us to family and colleagues."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
        {whyChooseUs.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.title} interactive padding="lg" className="group h-full">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center shadow-md group-hover:scale-105 transition-transform">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-ink-900 tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{p.body}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
