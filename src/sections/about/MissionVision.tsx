/**
 * MissionVision — premium split layout. Dark + Light cards side by side.
 */

import { Check, Compass, Target } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui";
import { missionVision } from "@/data/aboutContent";

export default function MissionVision() {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Mission & Vision"
        title={
          <>
            <span className="serif font-normal text-ink-600">What we're</span>{" "}
            <span className="text-gradient-brand">building toward.</span>
          </>
        }
        description="A long horizon — and the clear engineering principles to get there."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {/* Mission — dark card */}
        <Card surface="dark" radius="2xl" padding="xl" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2">
              <span className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-brand-300">
                <Target className="h-5 w-5" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-300">{missionVision.mission.label}</span>
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
              {missionVision.mission.title}
            </h3>
            <p className="mt-4 text-white/70 leading-relaxed">{missionVision.mission.body}</p>

            <ul className="mt-6 space-y-2.5">
              {missionVision.mission.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-brand-500/20 grid place-items-center shrink-0">
                    <Check className="h-3 w-3 text-brand-400" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Vision — light card */}
        <Card surface="white" radius="2xl" padding="xl" className="relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-300/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2">
              <span className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 grid place-items-center text-amber-600">
                <Compass className="h-5 w-5" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-amber-700">{missionVision.vision.label}</span>
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-ink-900">
              {missionVision.vision.title}
            </h3>
            <p className="mt-4 text-ink-600 leading-relaxed">{missionVision.vision.body}</p>

            <ul className="mt-6 space-y-2.5">
              {missionVision.vision.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-ink-800">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-amber-100 grid place-items-center shrink-0">
                    <Check className="h-3 w-3 text-amber-700" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </Section>
  );
}
