/**
 * RoiSavings — modern dashboard-style savings module.
 *
 * Replaces the previous full-width dark spec table. Now:
 *   • Headline + lead on the left
 *   • Three "popular system size" cards on the right
 *   • One row of compact stats
 *   • Single CTA strip
 *
 * Light + bright tone (no large dark section) keeps the page rhythm balanced.
 */

import { ArrowRight, IndianRupee, Sun, TrendingUp } from "lucide-react";
import { Section, SectionHeader, Card, Button } from "@/components/ui";

interface PackageCard {
  size: string;
  popular?: boolean;
  monthly: string;
  yearly: string;
  payback: string;
  area: string;
}

const PACKAGES: PackageCard[] = [
  { size: "3 kW",  monthly: "₹3,600",  yearly: "₹43,200",  payback: "4 yrs",  area: "210 sq.ft" },
  { size: "5 kW",  monthly: "₹6,000",  yearly: "₹72,000",  payback: "3.8 yrs", area: "350 sq.ft", popular: true },
  { size: "10 kW", monthly: "₹12,000", yearly: "₹1.44 L",  payback: "3.5 yrs", area: "700 sq.ft" },
];

const HIGHLIGHTS = [
  { value: "₹0",       label: "Down payment with EMI" },
  { value: "Up to 90%",label: "Avg. bill reduction" },
  { value: "3–5 yrs",  label: "Typical payback" },
  { value: "25 yrs",   label: "Generation lifetime" },
];

export default function RoiSavings() {
  return (
    <Section id="roi" tone="white" padding="lg">
      <SectionHeader
        eyebrow="ROI & Savings"
        title={
          <>
            <span className="serif font-normal text-ink-600">Real numbers.</span>{" "}
            <span className="text-gradient-brand">Real savings.</span>
          </>
        }
        description="Every quote we provide includes a full 25-year financial model — based on your actual consumption, tariff slab and roof orientation."
      />

      {/* 3 package cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {PACKAGES.map((p) => <PackageCardView key={p.size} pkg={p} />)}
      </div>

      {/* Highlights strip */}
      <Card padding="lg" surface="paper" className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-x divide-ink-900/[0.06]">
          {HIGHLIGHTS.map((h, i) => (
            <div key={h.label} className={`text-center md:text-left ${i === 0 ? "" : "pl-4 md:pl-6"}`}>
              <div className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-tight">{h.value}</div>
              <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-ink-500 mt-1">{h.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tight CTA strip — not a giant dark section */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-600">
        <p className="text-center sm:text-left">
          Figures vary by city, tariff slab & roof orientation — get your custom report in 24 hrs.
        </p>
        <Button as="a" href="#consultation" size="md" trailingArrow>
          Calculate my savings
        </Button>
      </div>
    </Section>
  );
}

/* ============================================================
   PACKAGE CARD
   ============================================================ */

function PackageCardView({ pkg }: { pkg: PackageCard }) {
  return (
    <Card
      interactive
      padding="lg"
      className={`relative h-full flex flex-col ${pkg.popular ? "ring-2 ring-brand-500" : ""}`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 shadow-md">
          ★ Most chosen
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 grid place-items-center">
            <Sun className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">System size</div>
            <div className="text-xl font-extrabold text-ink-900 leading-none mt-0.5">{pkg.size}</div>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">{pkg.area}</span>
      </div>

      {/* Big monthly savings number */}
      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-700">Monthly savings</div>
        <div className="mt-1 flex items-baseline gap-1">
          <IndianRupee className="h-5 w-5 text-emerald-600" strokeWidth={3} />
          <span className="text-3xl md:text-[2rem] font-extrabold text-ink-900 tracking-tight">
            {pkg.monthly.replace("₹", "")}
          </span>
        </div>
      </div>

      {/* Mini stats */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <MiniStat label="Yearly" value={pkg.yearly} />
        <MiniStat label="Payback" value={pkg.payback} icon={<TrendingUp className="h-3 w-3 text-amber-600" />} />
      </div>

      <Button as="a" href="#consultation" size="md" trailing={<ArrowRight className="h-4 w-4" />} className="mt-6 w-full justify-between">
        Get this quote
      </Button>
    </Card>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-paper border hairline px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-ink-500 font-bold flex items-center gap-1">
        {icon} {label}
      </div>
      <div className="text-sm font-extrabold text-ink-900 mt-0.5">{value}</div>
    </div>
  );
}
