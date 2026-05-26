/**
 * AboutHero — premium 2-column hero for /about.
 * Editorial headline · short emotional subheading · 2 CTAs · ambient image.
 */

import { Play, Sparkles } from "lucide-react";
import { Section, Backdrop, Button, Image } from "@/components/ui";
import { aboutHero } from "@/data/aboutContent";

export default function AboutHero() {
  return (
    <Section
      tone="paper"
      padding="none"
      className="pt-28 md:pt-32 pb-16 md:pb-20"
      backdrop={<Backdrop preset="aurora-light" />}
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 pl-1.5 pr-4 py-1 text-xs font-semibold text-brand-800 shadow-soft">
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center text-white">
              <Sparkles className="h-3 w-3" />
            </span>
            {aboutHero.badge}
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="mt-6 text-[2.4rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            {aboutHero.headline.line1}{" "}
            <span className="serif font-normal text-brand-700">{aboutHero.headline.serif}</span>{" "}
            <span className="text-gradient-brand">{aboutHero.headline.gradient}</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ink-600 max-w-xl leading-[1.65]">
            {aboutHero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="a" href={aboutHero.primaryCta.href} variant="primary" size="lg" trailingArrow>
              {aboutHero.primaryCta.label}
            </Button>
            <Button as="a" href={aboutHero.secondaryCta.href} variant="ghost" size="lg" leading={<Play className="h-3.5 w-3.5 text-brand-600 fill-current ml-0.5" />}>
              {aboutHero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: ".15s" }}>
          <div className="relative rounded-[1.75rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5 img-cinematic">
            <Image
              src={aboutHero.image}
              alt="ChaitanyaSri Greentech solar installation"
              fallback="rooftop"
              priority
              className="w-full aspect-[4/5] sm:aspect-[5/6] object-cover img-duotone"
            />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 font-bold">Headquartered in</div>
              <div className="mt-1 font-semibold text-base sm:text-lg">Lucknow · Varanasi · India</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
