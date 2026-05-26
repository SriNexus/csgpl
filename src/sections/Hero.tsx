/**
 * Hero — premium 2-column layout.
 *
 * Left: badge · headline · sub · 2 CTAs · trust strip
 * Right: large cinematic image with a single floating "live savings" card
 *
 * Strict rhythm: nothing competes with the headline; CTAs are unambiguous;
 * the partner marquee lives just below as a clean trust band.
 */

import { ArrowRight, Phone, Play, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Section, Backdrop, Button, Image } from "@/components/ui";
import { heroContent } from "@/data/content";

type HeroContent = typeof heroContent;
export interface HeroProps { content?: HeroContent }

export default function Hero({ content = heroContent }: HeroProps) {
  return (
    <Section
      tone="paper"
      padding="none"
      className="pt-28 md:pt-32 pb-16 md:pb-20"
      backdrop={<Backdrop preset="aurora-light" />}
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <HeroCopy content={content} />
        <HeroVisual content={content} />
      </div>

      {/* Quiet partner band — clean horizontal logos */}
      <PartnerStrip partners={content.partners} />
    </Section>
  );
}

/* ============================================================
   COPY (left column)
   ============================================================ */

function HeroCopy({ content }: { content: HeroContent }) {
  return (
    <div className="lg:col-span-7 animate-fade-up">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 pl-1.5 pr-4 py-1 text-xs font-semibold text-brand-800 shadow-soft">
        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center text-white">
          <Sparkles className="h-3 w-3" />
        </span>
        {content.badge}
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <h1 className="mt-6 text-[2.4rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
        {content.headlineParts.line1} with{" "}
        <span className="serif font-normal text-brand-700">{content.headlineParts.serif}</span>{" "}
        <span className="text-gradient-brand">{content.headlineParts.gradient}</span>
      </h1>

      <p className="mt-5 text-base sm:text-lg text-ink-600 max-w-xl leading-[1.65]">
        {content.description}
      </p>

      {/* 2 primary CTAs — no tertiary distraction */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button as="a" href={content.ctas.primary.href} variant="primary" size="lg" trailingArrow>
          Get Free Consultation
        </Button>
        <Button as="a" href={content.ctas.tertiary.href} variant="ghost" size="lg" leading={<Play className="h-3.5 w-3.5 text-brand-600 fill-current ml-0.5" />}>
          How it works
        </Button>
      </div>

      {/* Trust micro-badges */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink-600">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> 25-year warranty
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <TrendingUp className="h-3.5 w-3.5 text-brand-600" /> 3–5 yr ROI
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Phone className="h-3.5 w-3.5 text-brand-600" /> Free site survey
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   VISUAL (right column) — one image, one floating card
   ============================================================ */

function HeroVisual({ content }: { content: HeroContent }) {
  const fp = content.featuredProject;
  return (
    <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: ".15s" }}>
      <div className="relative rounded-[1.75rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5 img-cinematic">
        <Image
          src={fp.image}
          alt="Rooftop solar installation by CSGPL"
          fallback="rooftop"
          priority
          className="w-full aspect-[4/5] sm:aspect-[5/6] object-cover img-duotone"
        />

        {/* Bottom strip — featured project metadata */}
        <div className="absolute inset-x-5 bottom-5 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 font-bold">{fp.label}</div>
              <div className="mt-1 font-semibold text-base sm:text-lg">{fp.title}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/70 uppercase tracking-wider">{fp.metricLabel}</div>
              <div className="font-extrabold text-amber-300 text-xl">{fp.metricValue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Single floating KPI — premium minimalism */}
      <div className="absolute -left-3 sm:-left-6 top-6 sm:top-8 animate-float-slow">
        <div className="glass rounded-2xl px-4 py-3 shadow-premium flex items-center gap-3 min-w-[210px]">
          <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white grid place-items-center shadow-md shrink-0">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold">Bill reduction</div>
            <div className="text-2xl font-extrabold text-ink-900 tracking-tight">
              up to <span className="text-brand-600">90%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact CTA hint on mobile (visible only when image is full-width) */}
      <a
        href={content.ctas.primary.href}
        className="absolute -bottom-4 right-5 lg:hidden inline-flex items-center gap-2 rounded-full bg-white text-ink-900 font-bold text-xs px-4 py-2 shadow-premium border hairline"
      >
        Get quote <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ============================================================
   PARTNER STRIP — quiet logo wall
   ============================================================ */

function PartnerStrip({ partners }: { partners: readonly string[] }) {
  return (
    <div className="mt-16 lg:mt-20">
      <div className="text-center text-[10px] uppercase tracking-[0.32em] text-ink-500 font-bold mb-6">
        Trusted by India's leading solar projects · Powered by tier-1 brands
      </div>
      <div className="relative overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-14 w-max animate-marquee">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-14 px-8">
              {partners.map((b) => (
                <div key={b + dup} className="shrink-0 text-lg sm:text-xl font-extrabold tracking-tight text-ink-400 hover:text-ink-700 transition-colors">
                  {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
