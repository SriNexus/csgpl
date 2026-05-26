/**
 * Achievements — premium KPI strip with animated counters.
 */

import { Section, SectionHeader } from "@/components/ui";
import { useCounter } from "@/hooks/useCounter";
import { useInView } from "@/hooks/useInView";
import { achievements, type AchievementStat } from "@/data/aboutContent";

export default function Achievements() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section tone="white" padding="lg">
      <SectionHeader
        eyebrow="By the Numbers"
        title={
          <>
            <span className="serif font-normal text-ink-600">Measured by</span>{" "}
            <span className="text-gradient-brand">trust delivered.</span>
          </>
        }
        description="Quietly compounding results across two decades — every number behind a real customer relationship."
      />

      <div ref={ref} className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {achievements.map((s) => <CounterCard key={s.label} stat={s} inView={inView} />)}
      </div>
    </Section>
  );
}

function CounterCard({ stat, inView }: { stat: AchievementStat; inView: boolean }) {
  // For decimals (e.g. 3.5 MW) we animate ×10 then format
  const integerTarget = Number.isInteger(stat.target) ? stat.target : Math.round(stat.target * 10);
  const counted = useCounter(integerTarget, inView, 1800);
  const display = Number.isInteger(stat.target)
    ? counted.toLocaleString("en-IN")
    : (counted / 10).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-paper border hairline px-5 py-6 sm:p-7 group hover:border-brand-300 transition">
      <div className="text-3xl sm:text-4xl md:text-[2.5rem] font-extrabold text-ink-900 tracking-tight leading-none">
        {stat.prefix}
        <span className="text-gradient-brand">{display}</span>
        <span className="text-ink-700">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.18em] font-extrabold text-ink-700">
        {stat.label}
      </div>
      {stat.hint && (
        <div className="mt-1.5 text-xs text-ink-500">{stat.hint}</div>
      )}

      {/* Subtle bottom glow on hover */}
      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
}
