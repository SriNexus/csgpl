/**
 * WorkProcess — 5-step horizontal process timeline on the About page.
 * Mirrors the homepage Process aesthetic but uses About-specific copy.
 */

import { Activity, HardHat, MessageSquare, PenTool, Search, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";
import { workProcess } from "@/data/aboutContent";

const ICONS: LucideIcon[] = [MessageSquare, Search, PenTool, HardHat, Activity];

export default function WorkProcess() {
  return (
    <Section tone="white" padding="lg">
      <SectionHeader
        eyebrow="How We Work"
        title={
          <>
            <span className="serif font-normal text-ink-600">Five steps,</span>{" "}
            <span className="text-gradient-brand">one accountable team.</span>
          </>
        }
        description="From the first call to long-term care — every step is owned by a single project manager."
      />

      {/* Desktop horizontal */}
      <div className="mt-14 relative hidden lg:block">
        <div className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />
        <ol className="grid grid-cols-5 gap-4 relative">
          {workProcess.map((s, i) => {
            const Icon = ICONS[i] ?? Activity;
            return (
              <li key={s.title} className="text-center group">
                <div className="relative mx-auto w-fit">
                  <div className="h-14 w-14 rounded-full bg-white border-2 border-brand-200 grid place-items-center shadow-soft group-hover:border-brand-500 group-hover:shadow-premium transition">
                    <Icon className="h-6 w-6 text-brand-700" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="mt-5 text-base font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-xs text-ink-600 leading-relaxed max-w-[22ch] mx-auto">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile vertical */}
      <ol className="mt-12 lg:hidden space-y-3">
        {workProcess.map((s, i) => {
          const Icon = ICONS[i] ?? Activity;
          return (
            <li key={s.title} className="flex items-start gap-4 rounded-2xl bg-paper border hairline p-4">
              <div className="relative shrink-0">
                <div className="h-11 w-11 rounded-full bg-white border border-brand-200 grid place-items-center">
                  <Icon className="h-5 w-5 text-brand-700" />
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-paper">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-sm font-bold text-ink-900">{s.title}</h3>
                <p className="text-xs text-ink-600 leading-relaxed mt-1">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
