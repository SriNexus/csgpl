/**
 * TrustBand — premium brand portfolio strip + a single condensed testimonial.
 */

import { Star } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui";
import { trustPartners } from "@/data/aboutContent";
import { testimonials } from "@/data/content";

export default function TrustBand() {
  const featured = testimonials[0];

  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow={trustPartners.eyebrow}
        title={
          <>
            <span className="serif font-normal text-ink-600">{trustPartners.title.split(".")[0]}.</span>
          </>
        }
        description={trustPartners.body}
      />

      {/* Brand logos band */}
      <div className="mt-12 rounded-2xl bg-white border hairline px-6 py-8 shadow-soft">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-4 items-center">
          {trustPartners.brands.map((b) => (
            <div
              key={b}
              className="text-center text-base sm:text-lg font-extrabold tracking-tight text-ink-400 hover:text-ink-700 transition-colors"
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Single featured testimonial */}
      {featured && (
        <div className="mt-10">
          <Card padding="xl" surface="white" className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-0.5 text-amber-400 mb-5">
              {Array.from({ length: featured.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="serif text-xl sm:text-2xl leading-[1.4] text-ink-900 not-italic font-normal">
              "{featured.text}"
            </blockquote>
            <div className="mt-6 pt-5 border-t hairline flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 grid place-items-center text-white text-xs font-extrabold ring-2 ring-white shadow-soft">
                {featured.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="text-left">
                <div className="font-bold text-ink-900 text-sm">{featured.name}</div>
                <div className="text-[11px] text-ink-500">{featured.role}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Section>
  );
}
