/**
 * SolutionPage — shared template for /solutions/{residential,commercial,industrial}.
 *
 * Driven entirely by a `SolutionConfig`. Visual structure is identical across
 * verticals; only copy, accent colour and imagery vary.
 *
 * Sections rendered:
 *   1. Hero (split, floating KPI)
 *   2. Benefits (4-up icon cards)
 *   3. How Solar Works (split — illustration + 4-step flow)
 *   4. ROI dashboard cards
 *   5. Financing / Subsidy split
 *   6. Installation Process (6-step horizontal timeline)
 *   7. Why Choose Us (6 trust cards) + Product Ecosystem strip
 *   8. Project Showcase (1 featured + 3 secondary)
 *   9. Consultation split (value + form)
 *  10. FAQ accordion
 *  11. Final CTA
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, Loader2, Mail, MapPin,
  MessageCircle, Phone, Play, Plus, Sparkles, User, IndianRupee, Sun, Zap,
} from "lucide-react";
import { Section, Backdrop, Button, Image, Card, Badge } from "@/components/ui";
import { Input, Select } from "@/components/ui";
import { INSTALL_PROCESS, type SolutionConfig } from "@/data/solutionsContent";
import { consultationOptions } from "@/data/content";
import { submitLead } from "@/lib/leads";
import { site } from "@/data/site";

/* ============================================================
   PRIMARY EXPORT
   ============================================================ */
export default function SolutionPage({ config }: { config: SolutionConfig }) {
  return (
    <>
      <Hero config={config} />
      <Benefits config={config} />
      <HowSolarWorks config={config} />
      <RoiDashboard config={config} />
      <Financing config={config} />
      <InstallProcess config={config} />
      <WhyChooseUs config={config} />
      <ProjectShowcase config={config} />
      <ConsultationSplit config={config} />
      <FaqSection config={config} />
      <FinalCta config={config} />
    </>
  );
}

/* ============================================================
   1. HERO
   ============================================================ */
function Hero({ config }: { config: SolutionConfig }) {
  const { hero } = config;
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
            <span className={`h-6 w-6 rounded-full bg-gradient-to-br ${config.accent.from} ${config.accent.to} grid place-items-center text-white`}>
              <Sparkles className="h-3 w-3" />
            </span>
            {hero.badge}
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="mt-6 text-[2.4rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            {hero.headline.line1}{" "}
            <span className="serif font-normal text-brand-700">{hero.headline.serif}</span>{" "}
            <span className="text-gradient-brand">{hero.headline.gradient}</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ink-600 max-w-xl leading-[1.65]">{hero.description}</p>

          {/* 4 feature highlights — compact chip row */}
          <ul className="mt-7 grid grid-cols-2 gap-2.5 max-w-lg">
            {hero.highlights.map((h) => {
              const Icon = h.icon;
              return (
                <li key={h.label} className="flex items-center gap-2.5 text-[13px] font-semibold text-ink-800">
                  <span className="h-7 w-7 rounded-lg bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {h.label}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="a" href={hero.primaryCta.href} variant="primary" size="lg" trailingArrow>
              {hero.primaryCta.label}
            </Button>
            <Button as="a" href={hero.secondaryCta.href} variant="ghost" size="lg" leading={<Play className="h-3.5 w-3.5 text-brand-600 fill-current ml-0.5" />}>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Image + floating KPI */}
        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: ".15s" }}>
          <div className="relative rounded-[1.75rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5 img-cinematic">
            <Image src={hero.image} alt={hero.badge} fallback="rooftop" priority className="w-full aspect-[4/5] sm:aspect-[5/6] object-cover img-duotone" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 font-bold">{config.category.name}</div>
              <div className="mt-1 font-semibold text-base sm:text-lg">India · Designed for Indian climate</div>
            </div>
          </div>

          {/* Single floating KPI card */}
          <div className="absolute -left-3 sm:-left-6 top-6 sm:top-8 animate-float-slow">
            <div className="glass rounded-2xl px-4 py-3 shadow-premium flex items-center gap-3 min-w-[210px]">
              <span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${hero.floatingKpi.accent} text-white grid place-items-center shadow-md shrink-0`}>
                <Sun className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold">{hero.floatingKpi.label}</div>
                <div className="text-2xl font-extrabold text-ink-900 tracking-tight">{hero.floatingKpi.value}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   2. BENEFITS — 4-up icon cards
   ============================================================ */
function Benefits({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="white" padding="lg">
      <SectionHeading
        eyebrow="Why solar makes sense"
        title={<>The <span className="text-gradient-brand">value of switching.</span></>}
        description="Four reasons our customers consistently say solar is the smartest decision they've made."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        {config.benefits.map((b) => {
          const Icon = b.icon;
          return (
            <Card key={b.title} interactive padding="lg" className="group h-full">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${config.accent.from} ${config.accent.to} text-white grid place-items-center shadow-md group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-ink-900 tracking-tight">{b.title}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{b.body}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

/* ============================================================
   3. HOW SOLAR WORKS — split layout
   ============================================================ */
function HowSolarWorks({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeading
        eyebrow="How solar works"
        title={<>From <span className="serif font-normal text-ink-600">sunlight</span> to <span className="text-gradient-brand">savings.</span></>}
        description={config.howItWorks.intro}
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Illustration — premium gradient panel with central icon */}
        <div className="lg:col-span-5">
          <div className="relative rounded-[1.75rem] overflow-hidden shadow-soft border hairline aspect-[5/6] bg-gradient-to-br from-brand-50 via-amber-50 to-orange-50">
            <div className="absolute inset-0 bg-grid-fine opacity-40" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center px-6">
                <div className={`mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br ${config.accent.from} ${config.accent.to} text-white grid place-items-center shadow-premium animate-pulse-glow`}>
                  <Sun className="h-12 w-12" strokeWidth={1.5} />
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur border hairline px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] font-bold text-brand-700 shadow-soft">
                  Solar Energy Flow
                </div>
                <ConnectorLines />
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol className="lg:col-span-7 space-y-4">
          {config.howItWorks.steps.map((s, i) => (
            <li key={s.title} className="relative pl-14 group">
              <div className="absolute left-0 top-0 h-10 w-10 rounded-full bg-white border-2 border-brand-200 grid place-items-center font-extrabold text-brand-700 shadow-soft group-hover:border-brand-500 transition">
                {i + 1}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-ink-900 tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function ConnectorLines() {
  return (
    <div className="mt-8 flex items-center justify-center gap-3 opacity-60">
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-brand-500 to-brand-500" />
      <Zap className="h-4 w-4 text-amber-500" />
      <div className="h-px w-12 bg-gradient-to-r from-brand-500 via-brand-500 to-transparent" />
    </div>
  );
}

/* ============================================================
   4. ROI — dashboard-style cards
   ============================================================ */
function RoiDashboard({ config }: { config: SolutionConfig }) {
  const ACCENT_BG: Record<string, string> = {
    brand:   "bg-brand-100 text-brand-700",
    amber:   "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue:    "bg-blue-100 text-blue-700",
  };
  const ACCENT_TEXT: Record<string, string> = {
    brand:   "text-brand-700",
    amber:   "text-amber-700",
    emerald: "text-emerald-700",
    blue:    "text-blue-700",
  };

  return (
    <Section tone="white" padding="lg">
      <SectionHeading
        eyebrow="ROI & Savings"
        title={<><span className="serif font-normal text-ink-600">Real numbers,</span> <span className="text-gradient-brand">verifiable returns.</span></>}
        description={config.roi.intro}
      />

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {config.roi.cards.map((c) => (
          <Card key={c.label} interactive padding="lg" className="h-full">
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${ACCENT_BG[c.accent] || ACCENT_BG.brand}`}>
              <IndianRupee className="h-5 w-5" strokeWidth={3} />
            </div>
            <div className={`mt-5 text-3xl md:text-[2rem] font-extrabold tracking-tight ${ACCENT_TEXT[c.accent] || ACCENT_TEXT.brand}`}>
              {c.value}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.14em] font-bold text-ink-500">{c.label}</div>
            <div className="mt-3 text-xs text-ink-500 leading-relaxed">{c.hint}</div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-paper border hairline p-4 text-sm text-ink-600">
        <p className="text-center sm:text-left">
          Figures vary by tariff slab, load profile and site conditions — get your customised report inside 24 hours.
        </p>
        <Button as="a" href="#consultation-form" size="md" trailingArrow>Get my report</Button>
      </div>
    </Section>
  );
}

/* ============================================================
   5. FINANCING / SUBSIDY
   ============================================================ */
function Financing({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeading
        eyebrow="Subsidy & Financing"
        title={<><span className="serif font-normal text-ink-600">Bring the</span> <span className="text-gradient-brand">CAPEX down.</span></>}
        description="We handle subsidy filing, tax optimisation, and partner bank financing end-to-end."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {config.financing.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} interactive padding="xl" className="h-full">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${config.accent.from} ${config.accent.to} text-white grid place-items-center shadow-md shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge tone="brand" className="mb-3">{f.badge}</Badge>
                  <h3 className="text-xl font-extrabold text-ink-900 tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-sm text-ink-600 leading-relaxed">{f.body}</p>
                  {f.cta && (
                    <Button as="a" href={f.cta.href} variant="ghost" size="sm" trailingArrow className="mt-5">
                      {f.cta.label}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

/* ============================================================
   6. INSTALLATION PROCESS — 6-step horizontal timeline
   ============================================================ */
function InstallProcess({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="white" padding="lg">
      <SectionHeading
        eyebrow="Installation Process"
        title={<><span className="serif font-normal text-ink-600">Six steps,</span> <span className="text-gradient-brand">one accountable team.</span></>}
        description="From the first call to ongoing care — every step owned by a single project manager."
      />

      {/* Desktop horizontal */}
      <div className="mt-14 relative hidden lg:block">
        <div className="absolute left-[8%] right-[8%] top-7 h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />
        <ol className="grid grid-cols-6 gap-3 relative">
          {INSTALL_PROCESS.map((s, i) => (
            <li key={s.title} className="text-center group">
              <div className="relative mx-auto w-fit">
                <div className="h-14 w-14 rounded-full bg-white border-2 border-brand-200 grid place-items-center shadow-soft group-hover:border-brand-500 group-hover:shadow-premium transition">
                  <span className="text-sm font-extrabold text-brand-700">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
              <h3 className="mt-5 text-sm font-bold text-ink-900">{s.title}</h3>
              <p className="mt-1.5 text-[11px] text-ink-600 leading-relaxed max-w-[18ch] mx-auto">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile vertical */}
      <ol className="mt-12 lg:hidden space-y-3">
        {INSTALL_PROCESS.map((s, i) => (
          <li key={s.title} className="flex items-start gap-4 rounded-2xl bg-paper border hairline p-4">
            <div className="h-10 w-10 rounded-full bg-white border-2 border-brand-200 grid place-items-center shrink-0">
              <span className="text-xs font-extrabold text-brand-700">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-sm font-bold text-ink-900">{s.title}</h3>
              <p className="text-xs text-ink-600 leading-relaxed mt-1">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Tiny note */}
      <p className="mt-8 text-center text-xs text-ink-500">
        ⓘ Configuration uses {config.category.name.toLowerCase()}-grade components engineered for this duty cycle.
      </p>
    </Section>
  );
}

/* ============================================================
   7. WHY CHOOSE US — 6 trust cards + product ecosystem strip
   ============================================================ */
function WhyChooseUs({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="paper" padding="lg">
      <SectionHeading
        eyebrow="Why CSGPL"
        title={<><span className="serif font-normal text-ink-600">Engineered for</span> <span className="text-gradient-brand">25-year confidence.</span></>}
        description="Six commitments that translate to a system that performs — quietly, reliably, year after year."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 stagger">
        {config.whyChooseUs.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.title} interactive padding="lg" className="group h-full">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 shrink-0 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white transition">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-ink-900 leading-tight">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Product ecosystem strip */}
      <div className="mt-10 rounded-2xl bg-white border hairline shadow-soft p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-brand-700">Product Ecosystem</div>
            <div className="mt-1 font-bold text-ink-900">Every CSGPL system uses our tier-1 component stack.</div>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-700 arrow-link inline-flex items-center gap-1.5">
            Browse full catalog <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {config.productEcosystem.map((p) => (
            <li key={p.brand}>
              <Link to={p.href} className="block rounded-xl bg-paper border hairline px-3 py-3 hover:border-brand-300 transition text-center group">
                <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{p.category}</div>
                <div className="mt-1 text-sm font-extrabold text-ink-900 group-hover:text-brand-700 transition">{p.brand}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ============================================================
   8. PROJECT SHOWCASE — 1 featured + 3 secondary
   ============================================================ */
function ProjectShowcase({ config }: { config: SolutionConfig }) {
  const f = config.projects.featured;
  return (
    <Section tone="white" padding="lg">
      <SectionHeading
        eyebrow="Project Showcase"
        eyebrowTone="amber"
        title={<><span className="serif font-normal text-ink-600">Recent</span> <span className="text-gradient-brand">{config.category.name.toLowerCase()} deployments.</span></>}
        description="A snapshot of CSGPL's recent work — every system designed, supplied, installed and supported in-house."
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* Flagship */}
        <Card interactive padding="none" radius="2xl" className="lg:col-span-8 group overflow-hidden relative">
          <div className="relative aspect-[16/10] img-cinematic">
            <Image src={f.image} alt={f.title} fallback="industrial" priority className="h-full w-full object-cover img-zoom img-duotone" />
          </div>
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <Badge tone="amber" variant="loud">★ Flagship</Badge>
            <Badge tone="white" variant="loud">{f.type}</Badge>
          </div>
          <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <MapPin className="h-3.5 w-3.5" /> {f.location}
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{f.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              <MetricChip label="Capacity" value={f.size} />
              <MetricChip label="Output"   value={f.output} highlight />
              <MetricChip label="Type"     value={f.type} />
            </div>
          </div>
        </Card>

        {/* Secondary stack */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-6">
          {config.projects.others.map((p) => (
            <Card key={p.title} interactive padding="none" radius="lg" className="group overflow-hidden relative h-full">
              <div className="relative aspect-[16/10] img-cinematic">
                <Image src={p.image} alt={p.title} fallback="residential" className="h-full w-full object-cover img-zoom" />
              </div>
              <div className="absolute top-3 left-3">
                <Badge tone="white" className="text-ink-900">{p.type}</Badge>
              </div>
              <div className="absolute inset-x-4 bottom-4 text-white">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <MapPin className="h-3 w-3" /> {p.location}
                </div>
                <h3 className="mt-1 text-lg font-extrabold tracking-tight">{p.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-white/85">
                  <span className="font-bold">{p.size}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-emerald-300 font-bold">{p.output}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function MetricChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur ${highlight ? "bg-brand-500/90 border-brand-300/40 text-white" : "bg-white/15 border-white/20 text-white"}`}>
      <span className="text-white/70 uppercase tracking-wider text-[10px] hidden sm:inline">{label}:</span>
      <span className="font-extrabold">{value}</span>
    </span>
  );
}

/* ============================================================
   9. CONSULTATION SPLIT — value + form
   ============================================================ */
function ConsultationSplit({ config }: { config: SolutionConfig }) {
  return (
    <Section id="consultation-form" tone="paper" padding="lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Value prop */}
        <div className="lg:col-span-5">
          <div className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-brand-600" /> Free Consultation
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-[-0.025em] leading-[1.05] text-ink-900">
            {config.consultation.title}
          </h2>
          <p className="mt-4 lead">{config.consultation.subtitle}</p>

          <ul className="mt-7 space-y-3">
            {config.consultation.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink-800">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-brand-100 text-brand-700 grid place-items-center shrink-0 ring-1 ring-brand-200">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {/* Direct contact card */}
          <div className="mt-8 rounded-2xl bg-white border hairline shadow-soft p-4 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-bold">Talk to an expert</div>
              <a href={`tel:${site.contact.phonePrimaryRaw}`} className="block text-base font-extrabold text-ink-900 hover:text-brand-700">
                {site.contact.phonePrimary}
              </a>
            </div>
            <a href={site.contact.whatsappWithMsg} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center hover:bg-emerald-100 transition ring-1 ring-emerald-100">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <ConsultationForm vertical={config.category.name} />
        </div>
      </div>
    </Section>
  );
}

function ConsultationForm({ vertical }: { vertical: string }) {
  const initial = { name: "", phone: "", email: "", city: "", systemType: "", monthlyBill: "" };
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) { setStatus("error"); setMsg("Please enter your name and phone."); return; }
    setStatus("loading");
    const res = await submitLead({ ...form, source: `solutions:${vertical}` });
    setStatus("success");
    setMsg(res.ok ? "Thank you. Our solar expert will reach out within 24 hours." : "Thanks! Your enquiry is saved — our team will contact you shortly.");
    setForm(initial);
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-[1.75rem] bg-white text-ink-900 p-7 sm:p-9 shadow-premium border hairline">
      <div className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-500 text-white text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1.5 shadow-md">
        ⚡ Free Quote
      </div>

      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-ink-900 tracking-tight">Tell us about your project</h3>
          <p className="text-sm text-ink-500 mt-1">Takes under 60 seconds.</p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">Response</div>
          <div className="text-sm font-bold text-brand-700">&lt; 24 hours</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input icon={<User className="h-4 w-4" />}    label="Full Name *"        name="name"        value={form.name}        onChange={update("name")}        placeholder="Your name" />
        <Input icon={<Phone className="h-4 w-4" />}   label="Phone *"            name="phone"       value={form.phone}       onChange={update("phone")}       placeholder="+91 9xxxx xxxxx" type="tel" />
        <Input icon={<Mail className="h-4 w-4" />}    label="Email"              name="email"       value={form.email}       onChange={update("email")}       placeholder="you@example.com" type="email" />
        <Input icon={<MapPin className="h-4 w-4" />}  label="City"               name="city"        value={form.city}        onChange={update("city")}        placeholder="Lucknow / Varanasi" />
        <Select icon={<Zap className="h-4 w-4" />}    label="Requirement Type"   name="systemType"  value={form.systemType}  onChange={update("systemType")}  options={consultationOptions.systemTypes} />
        <Select icon={<IndianRupee className="h-4 w-4" />} label="Electricity Bill" name="monthlyBill" value={form.monthlyBill} onChange={update("monthlyBill")} options={consultationOptions.billRanges} />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-7 w-full rounded-2xl pl-6 pr-3 py-3.5 text-sm font-bold inline-flex items-center justify-between gap-3 disabled:opacity-60"
      >
        <span>{status === "loading" ? "Submitting…" : "Get My Free Consultation"}</span>
        <span className="h-9 w-9 rounded-full bg-white/15 grid place-items-center backdrop-blur">
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </span>
      </button>

      {status === "success" && (
        <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 inline-flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {msg}
        </div>
      )}
      {status === "error" && (
        <div className="mt-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3">{msg}</div>
      )}

      <p className="mt-5 text-[11px] text-ink-500 text-center leading-relaxed">
        By submitting, you agree to be contacted by CSGPL via phone, email or WhatsApp.
      </p>
    </form>
  );
}

/* ============================================================
   10. FAQ
   ============================================================ */
function FaqSection({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="white" padding="lg">
      <SectionHeading
        align="stacked"
        eyebrow="FAQ"
        title={<>Got questions? <br /><span className="serif font-normal text-ink-600">We've answered them.</span></>}
        description={`Industry-specific answers for ${config.category.name.toLowerCase()} customers.`}
      />

      <div className="mt-12 max-w-3xl mx-auto">
        <ul className="space-y-3">
          {config.faqs.map((f, i) => (
            <FaqRow key={f.q} index={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </ul>
      </div>
    </Section>
  );
}

function FaqRow({ index, q, a, defaultOpen }: { index: number; q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <li className={`rounded-2xl border transition-all overflow-hidden ${open ? "bg-white border-ink-900/15 shadow-soft" : "bg-white/60 border-ink-900/[0.08] hover:bg-white"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4">
        <span className="flex items-baseline gap-4">
          <span className="serif text-sm text-ink-400">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-bold text-ink-900 text-[15px] sm:text-base">{q}</span>
        </span>
        <span className={`h-8 w-8 shrink-0 rounded-full grid place-items-center transition-all ${open ? "bg-brand-600 text-white rotate-45" : "bg-paper-2 text-ink-700"}`}>
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 pl-[3.25rem] text-sm sm:text-[15px] text-ink-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </li>
  );
}

/* ============================================================
   11. FINAL CTA
   ============================================================ */
function FinalCta({ config }: { config: SolutionConfig }) {
  return (
    <Section tone="white" padding="md">
      <Card
        surface="dark"
        radius="2xl"
        padding="none"
        className="overflow-hidden relative px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20"
      >
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className={`absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br ${config.accent.from} ${config.accent.to} opacity-25 blur-[120px]`} />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready to start
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] leading-[1.05] text-white">
              {config.finalCta.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0">{config.finalCta.description}</p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <Button as="a" href="#consultation-form" variant="white" size="lg"
              trailing={<span className="h-9 w-9 rounded-full bg-ink-900 text-white grid place-items-center"><ArrowRight className="h-4 w-4" /></span>}
              className="w-full lg:w-auto justify-between"
            >
              Get Free Quote
            </Button>
            <Button as="a" href={`tel:${site.contact.phonePrimaryRaw}`} variant="ghost" size="lg"
              leading={<Phone className="h-4 w-4 text-brand-600" />}
              className="w-full lg:w-auto justify-center bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15"
            >
              Talk to Expert
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* ============================================================
   SHARED — section heading helper
   ============================================================ */
function SectionHeading({
  eyebrow, eyebrowTone, title, description, align = "split",
}: {
  eyebrow: string;
  eyebrowTone?: "brand" | "amber";
  title: React.ReactNode;
  description?: string;
  align?: "split" | "stacked";
}) {
  const ruleClass = eyebrowTone === "amber" ? "bg-amber-500" : "bg-brand-600";
  const textClass = eyebrowTone === "amber" ? "text-amber-700" : "text-brand-600";

  if (align === "stacked") {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className={`eyebrow flex items-center justify-center gap-3 ${textClass}`}>
          <span className={`h-px w-8 ${ruleClass}`} /> {eyebrow}
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-[3.6rem] font-extrabold tracking-[-0.03em] text-ink-900 leading-[1.02]">{title}</h2>
        {description && <p className="lead mt-5 mx-auto">{description}</p>}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-end">
      <div className="lg:col-span-7">
        <div className={`eyebrow flex items-center gap-3 ${textClass}`}>
          <span className={`h-px w-8 ${ruleClass}`} /> {eyebrow}
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-[3.6rem] font-extrabold tracking-[-0.03em] text-ink-900 leading-[1.02]">{title}</h2>
      </div>
      <div className="lg:col-span-5">
        {description && <p className="lead">{description}</p>}
      </div>
    </div>
  );
}
