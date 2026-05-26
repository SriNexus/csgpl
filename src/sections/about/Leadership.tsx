/**
 * Leadership — premium executive cards.
 *   Photo placeholder · name · designation · concise bio · philosophy quote · highlight chips
 */

import { Quote } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui";
import { leadership, type Leader } from "@/data/aboutContent";

export default function Leadership() {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Leadership"
        title={
          <>
            <span className="serif font-normal text-ink-600">The team</span>{" "}
            <span className="text-gradient-brand">behind every project.</span>
          </>
        }
        description="Two decades of energy industry experience, focused entirely on building one of India's most trusted solar EPC companies."
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
        {leadership.map((l) => <LeaderCard key={l.id} leader={l} />)}
      </div>
    </Section>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <Card interactive padding="none" radius="2xl" className="group flex flex-col h-full overflow-hidden">
      {/* Photo placeholder — gradient with initials */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-500 via-brand-700 to-ink-900 grid place-items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative serif font-medium text-[5.5rem] leading-none text-white/95 select-none">
          {leader.initials}
        </div>
        <span className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-[0.22em] font-bold text-white/70 text-center">
          ChaitanyaSri Greentech · {leader.role.split(" — ")[0]}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-extrabold text-ink-900 tracking-tight">{leader.name}</h3>
        <div className="mt-1 text-xs font-bold text-brand-700 uppercase tracking-[0.14em]">{leader.role}</div>

        <p className="mt-4 text-sm text-ink-600 leading-relaxed">{leader.bio}</p>

        <div className="mt-5 rounded-xl bg-paper border hairline px-4 py-3 relative">
          <Quote className="absolute top-2 right-2 h-4 w-4 text-brand-100" />
          <p className="serif text-[13px] not-italic leading-snug text-ink-800">{leader.philosophy}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {leader.highlights.map((h) => (
            <span key={h} className="inline-flex items-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              {h}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
