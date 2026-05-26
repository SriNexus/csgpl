/**
 * Process — clean horizontal 5-step timeline with connector progress line.
 *
 * Tight typography · numbered steps · subtle hover lift.
 * Replaces the previous airy step grid.
 */

import { Activity, FileCheck2, HardHat, MessageSquare, PenTool, Search } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";

interface Step {
  icon: typeof MessageSquare;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { icon: MessageSquare, title: "Consultation",     desc: "Free expert call · understand your needs & site" },
  { icon: Search,        title: "Site Survey",      desc: "On-site shadow analysis & roof load assessment" },
  { icon: PenTool,       title: "Design & Approval",desc: "Custom system design · DISCOM net-metering filing" },
  { icon: HardHat,       title: "Installation",     desc: "Certified installers · 3–7 day deployment" },
  { icon: Activity,      title: "Activation & Care",desc: "Commissioning · monitoring app · 25-yr support" },
];

// Make the typecheck happy
void FileCheck2;

export default function Process() {
  return (
    <Section id="process" tone="paper" padding="lg">
      <SectionHeader
        eyebrow="How it works"
        title={
          <>
            <span className="serif font-normal text-ink-600">From enquiry to</span>{" "}
            <span className="text-gradient-brand">energised — in 3 weeks.</span>
          </>
        }
        description="A single project manager owns your installation end-to-end. Transparent timelines · zero surprises."
      />

      {/* Desktop: horizontal timeline with connector line */}
      <div className="mt-14 relative hidden lg:block">
        {/* Connecting progress line */}
        <div className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

        <ol className="grid grid-cols-5 gap-4 relative">
          {STEPS.map((s, i) => <StepNode key={s.title} step={s} index={i} />)}
        </ol>
      </div>

      {/* Mobile/tablet: vertical compact list */}
      <ol className="mt-12 lg:hidden space-y-3">
        {STEPS.map((s, i) => <StepNodeMobile key={s.title} step={s} index={i} />)}
      </ol>
    </Section>
  );
}

function StepNode({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <li className="text-center group">
      {/* Numbered circle on top of the line */}
      <div className="relative mx-auto w-fit">
        <div className="h-14 w-14 rounded-full bg-white border-2 border-brand-200 grid place-items-center shadow-soft group-hover:border-brand-500 group-hover:shadow-premium transition">
          <Icon className="h-6 w-6 text-brand-700" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-paper">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <h3 className="mt-5 text-base font-bold text-ink-900">{step.title}</h3>
      <p className="mt-1.5 text-xs text-ink-600 leading-relaxed max-w-[22ch] mx-auto">{step.desc}</p>
    </li>
  );
}

function StepNodeMobile({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <li className="flex items-start gap-4 rounded-2xl bg-white border hairline p-4 shadow-soft">
      <div className="relative shrink-0">
        <div className="h-11 w-11 rounded-full bg-brand-50 border border-brand-200 grid place-items-center">
          <Icon className="h-5 w-5 text-brand-700" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-ink-900 text-white text-[10px] font-extrabold grid place-items-center ring-2 ring-white">
          {index + 1}
        </div>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="text-sm font-bold text-ink-900">{step.title}</h3>
        <p className="text-xs text-ink-600 leading-relaxed mt-1">{step.desc}</p>
      </div>
    </li>
  );
}
