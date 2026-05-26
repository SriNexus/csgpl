/**
 * Testimonials — modern 3-up compact card layout.
 *
 * Replaces the previous "big pull-quote + stack" layout with a balanced
 * scannable grid. Short reviews, prominent ratings, customer initials avatar.
 */

import { Star } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui";
import { testimonials as testimonialSeeds } from "@/data/content";
import { site } from "@/data/site";
import type { TestimonialRecord } from "@/cms";

export interface TestimonialsProps { items?: TestimonialRecord[] }

type T = { name: string; role: string; system: string; text: string; rating: number };

export default function Testimonials({ items }: TestimonialsProps) {
  const list: T[] = (items && items.length ? items : testimonialSeeds) as T[];
  if (!list.length) return null;

  // Limit to 3 — premium feel beats showing every review
  const visible = list.slice(0, 3);

  return (
    <Section tone="white" padding="lg">
      <SectionHeader
        eyebrow="Customer Voices"
        title={
          <>
            <span className="serif font-normal text-ink-600">Loved by</span>{" "}
            <span className="text-gradient-brand">{site.trust.reviewsCount}+ families</span>{" "}
            <span className="serif font-normal text-ink-600">& businesses.</span>
          </>
        }
        aside={
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-paper border hairline px-4 py-2.5">
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <div className="text-sm">
              <span className="font-extrabold text-ink-900">{site.trust.rating} / 5</span>
              <span className="text-ink-500"> · {site.trust.reviewsCount}+ reviews</span>
            </div>
          </div>
        }
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
        {visible.map((t) => <TestimonialCard key={t.name} t={t} />)}
      </div>
    </Section>
  );
}

function TestimonialCard({ t }: { t: T }) {
  return (
    <Card interactive padding="lg" className="flex flex-col h-full">
      {/* Rating */}
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>

      {/* Review — capped via line-clamp */}
      <p className="mt-4 text-[15px] text-ink-800 leading-relaxed flex-1 line-clamp-5">
        "{t.text}"
      </p>

      {/* Author */}
      <div className="mt-6 pt-5 border-t hairline flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 grid place-items-center text-white text-xs font-extrabold ring-2 ring-white shadow-soft">
          {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink-900 text-sm truncate">{t.name}</div>
          <div className="text-[11px] text-ink-500 truncate">{t.role}</div>
        </div>
        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 rounded-full px-2 py-0.5 shrink-0 ring-1 ring-brand-100">
          {t.system.split(" ")[0]}
        </span>
      </div>
    </Card>
  );
}
