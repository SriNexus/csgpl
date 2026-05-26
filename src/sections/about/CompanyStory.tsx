/**
 * CompanyStory — vertical timeline with editorial intro.
 * Premium storytelling, not SEO copy.
 */

import { Section, SectionHeader, Card } from "@/components/ui";
import { companyStory } from "@/data/aboutContent";

export default function CompanyStory() {
  return (
    <Section tone="white" padding="lg">
      <SectionHeader
        eyebrow={companyStory.eyebrow}
        title={
          <>
            {companyStory.title}{" "}
            <span className="text-gradient-brand">{companyStory.titleAccent}</span>
          </>
        }
        description={companyStory.intro}
      />

      {/* Timeline */}
      <div className="mt-14 grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <Card surface="paper" padding="lg" className="shadow-soft">
            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-700">Two decades</div>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">
              From energy consulting <br />
              to <span className="text-gradient-brand">solar EPC leadership.</span>
            </h3>
            <p className="mt-4 text-sm text-ink-600 leading-relaxed">
              Every system we install today carries the lessons of every project we've delivered before.
              Engineering discipline, transparent customer relationships, and a commitment to long-term
              partnership — these are the company's compounding investments.
            </p>
          </Card>
        </div>

        {/* Milestones */}
        <ol className="lg:col-span-7 relative">
          {/* Spine */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-200 via-brand-400 to-brand-200" aria-hidden />
          <div className="space-y-7">
            {companyStory.milestones.map((m, i) => (
              <li key={m.year} className="relative pl-14">
                {/* Dot */}
                <div className="absolute left-0 top-1 h-10 w-10 rounded-full bg-white border-2 border-brand-300 grid place-items-center shadow-soft">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-700" />
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-brand-700">
                  Milestone {String(i + 1).padStart(2, "0")} · {m.year}
                </div>
                <h4 className="mt-2 text-lg sm:text-xl font-extrabold text-ink-900 tracking-tight">{m.title}</h4>
                <p className="mt-2 text-[15px] text-ink-600 leading-relaxed">{m.body}</p>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </Section>
  );
}
