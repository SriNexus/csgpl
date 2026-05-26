/**
 * ProductsCta — call-to-action strip used at the bottom of every product page.
 */

import { ArrowRight, Download, MessageCircle, Phone } from "lucide-react";
import { Section, Card } from "@/components/ui";
import { site } from "@/data/site";

export interface ProductsCtaProps {
  /** Optional headline override (defaults to "Ready to build your solar project?") */
  title?: string;
  /** Subtitle override */
  description?: string;
}

export default function ProductsCta({
  title = "Ready to build your solar project?",
  description = "Get expert guidance for selecting the right solar panels, inverters, batteries, structures and accessories for your residential, commercial or industrial installation.",
}: ProductsCtaProps) {
  return (
    <Section tone="white" padding="lg">
      <Card surface="dark" radius="2xl" padding="xl" className="overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-300">Talk to a solar expert</div>
            <h3 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] leading-tight">
              {title}
            </h3>
            <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="/#consultation"
              className="inline-flex items-center justify-between gap-3 rounded-full bg-white text-brand-800 font-bold pl-5 pr-2 py-2.5 hover:bg-amber-300 transition-colors shadow-lg"
            >
              Get Free Quote
              <span className="h-9 w-9 rounded-full bg-brand-800 text-white grid place-items-center">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href={`tel:${site.contact.phonePrimaryRaw}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white font-bold px-5 py-2.5 hover:bg-white/15 transition-colors"
            >
              <Phone className="h-4 w-4" /> Contact Solar Expert
            </a>
            <a
              href={site.contact.whatsappWithMsg}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white font-bold px-5 py-2.5 hover:bg-white/15 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Chat
            </a>
            <a
              href="/#consultation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-white/80 font-semibold px-5 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Request Datasheet
            </a>
          </div>
        </div>
      </Card>
    </Section>
  );
}
