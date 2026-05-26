/**
 * AboutFinalCta — gradient closer banner.
 */

import { ArrowRight, Phone } from "lucide-react";
import { Section, Card, Button } from "@/components/ui";
import { aboutFinalCta } from "@/data/aboutContent";

export default function AboutFinalCta() {
  return (
    <Section tone="white" padding="md">
      <Card
        surface="dark"
        radius="2xl"
        padding="none"
        className="overflow-hidden relative px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
      >
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {aboutFinalCta.badge}
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] leading-[1.05] text-white">
              {aboutFinalCta.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
              {aboutFinalCta.body}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <Button
              as="a"
              href={aboutFinalCta.primaryCta.href}
              variant="white"
              size="lg"
              trailing={<span className="h-9 w-9 rounded-full bg-ink-900 text-white grid place-items-center"><ArrowRight className="h-4 w-4" /></span>}
              className="w-full lg:w-auto justify-between"
            >
              {aboutFinalCta.primaryCta.label}
            </Button>
            <Button
              as="a"
              href={aboutFinalCta.secondaryCta.href}
              variant="ghost"
              size="lg"
              leading={<Phone className="h-4 w-4 text-brand-600" />}
              className="w-full lg:w-auto justify-center bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15"
            >
              {aboutFinalCta.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}
