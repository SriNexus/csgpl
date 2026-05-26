/**
 * FinalCta — premium full-bleed gradient CTA banner.
 *
 * One headline · two clear CTAs (Get Quote · Talk to Expert) ·
 * minimal supporting text. Designed to be the page closer.
 */

import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Section, Card, Button } from "@/components/ui";
import { site } from "@/data/site";

export default function FinalCta() {
  return (
    <Section tone="white" padding="md">
      <Card
        surface="dark"
        radius="2xl"
        padding="none"
        className="overflow-hidden relative px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
      >
        {/* Background gradient & decorative blurs */}
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready to start
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] leading-[1.05] text-white">
              Start saving with <br className="hidden sm:block" />
              <span className="text-gradient-warm">solar today.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
              Free site survey · customised proposal in 24 hours · subsidy & financing handled end-to-end.
            </p>
          </div>

          {/* Right: CTAs */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <Button
              as="a"
              href="#consultation"
              variant="white"
              size="lg"
              trailing={<span className="h-9 w-9 rounded-full bg-ink-900 text-white grid place-items-center"><ArrowRight className="h-4 w-4" /></span>}
              className="w-full lg:w-auto justify-between"
            >
              Get Free Quote
            </Button>

            <Button
              as="a"
              href={`tel:${site.contact.phonePrimaryRaw}`}
              variant="ghost"
              size="lg"
              leading={<Phone className="h-4 w-4 text-brand-600" />}
              className="w-full lg:w-auto justify-center bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15"
            >
              Talk to Expert · {site.contact.phonePrimary}
            </Button>

            <a
              href={site.contact.whatsappWithMsg}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1.5 lg:justify-end"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Or message us on WhatsApp
            </a>
          </div>
        </div>
      </Card>
    </Section>
  );
}
