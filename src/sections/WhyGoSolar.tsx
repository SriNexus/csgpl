/**
 * WhyGoSolar — tighter 1 dark feature + 4 compact bullet cards.
 * Reduces the previous 5-card grid to a cleaner asymmetric layout.
 */

import { ArrowUpRight, Wallet } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui";
import { whyFeatures } from "@/data/content";

export default function WhyGoSolar() {
  // Take 4 most impactful benefits (skip the long-term-savings duplicate of ROI section)
  const features = whyFeatures.slice(0, 4);

  return (
    <Section tone="white" padding="lg">
      <SectionHeader
        eyebrow="Why Go Solar"
        title={
          <>
            <span className="serif font-normal text-ink-600">Smarter energy.</span>{" "}
            <span className="text-gradient-brand">Smarter savings.</span>
          </>
        }
        description="One of the most predictable investments your home or business can make. Here's why."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* Feature hero */}
        <FeatureHero />

        {/* Compact benefit cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
          {features.map((it) => {
            const Icon = it.icon;
            return (
              <Card key={it.title} interactive padding="lg" className="group h-full">
                <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white transition-all">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900">{it.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{it.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function FeatureHero() {
  return (
    <Card surface="dark" radius="2xl" padding="xl" className="lg:col-span-5 group relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative">
        <Badge tone="glass-dark" icon={<Wallet className="h-3.5 w-3.5" />} className="text-brand-300">
          Hero benefit
        </Badge>
        <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white">
          Cut your bills <span className="text-gradient-warm">by up to 90%.</span>
        </h3>
        <p className="mt-3 text-white/70 leading-relaxed text-sm sm:text-base">
          The average CSGPL customer's first post-installation bill drops from ₹6,500 to under ₹500.
          The savings compound — year after year.
        </p>
      </div>

      {/* Visual bill comparison */}
      <div className="relative mt-7 grid grid-cols-2 gap-3">
        <BillTile label="Before solar" amount="₹6,500" tone="rose" fill={100} />
        <BillTile label="After solar"  amount="₹430"   tone="brand" fill={8} />
      </div>

      <a href="#consultation" className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-300 hover:text-white arrow-link">
        See your estimate <ArrowUpRight className="h-4 w-4" />
      </a>
    </Card>
  );
}

function BillTile({
  label, amount, tone, fill,
}: { label: string; amount: string; tone: "brand" | "rose"; fill: number }) {
  const wrap = tone === "brand" ? "bg-brand-500/10 border-brand-400/30" : "bg-white/[0.04] border-white/10";
  const labelCls = tone === "brand" ? "text-brand-300" : "text-white/50";
  const amountCls = tone === "brand" ? "text-emerald-300" : "text-white";
  const fillCls = tone === "brand" ? "bg-emerald-400" : "bg-rose-400/80";
  return (
    <div className={`rounded-2xl border p-4 ${wrap}`}>
      <div className={`text-[10px] uppercase tracking-wider ${labelCls}`}>{label}</div>
      <div className={`mt-1.5 text-2xl font-extrabold ${amountCls}`}>{amount}</div>
      <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${fillCls}`} style={{ width: `${fill}%` }} />
      </div>
    </div>
  );
}
