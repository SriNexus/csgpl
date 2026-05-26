/**
 * Projects — 1 featured flagship + 2 secondary projects.
 * Clean image-card storytelling with overlaid energy metrics.
 */

import { ArrowUpRight, MapPin, TrendingUp, Zap } from "lucide-react";
import { Section, SectionHeader, Badge, Image, Card } from "@/components/ui";
import { projects as projectSeeds } from "@/data/content";
import type { ProjectRecord } from "@/cms";

export interface ProjectsProps { items?: ProjectRecord[] }

type ProjectLike = {
  title: string; loc: string; kw: string; savings: string; co2: string; img: string; type: string;
};

export default function Projects({ items }: ProjectsProps) {
  const list: ProjectLike[] = (items && items.length ? items : projectSeeds) as ProjectLike[];
  if (!list.length) return null;
  const [hero, ...rest] = list;

  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Project Showcase"
        eyebrowTone="amber"
        title={
          <>
            <span className="serif font-normal text-ink-600">Powering</span> homes,{" "}
            <span className="text-gradient-brand">businesses & industries.</span>
          </>
        }
        aside={
          <a href="#" className="text-sm font-bold text-brand-700 arrow-link inline-flex items-center gap-1.5 mt-5">
            View all 200+ projects <ArrowUpRight className="h-4 w-4" />
          </a>
        }
      />

      {/* Featured + 2 secondary */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        <FlagshipCard p={hero} />
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-6">
          {rest.slice(0, 2).map((p) => <SecondaryCard key={p.title} p={p} />)}
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   FLAGSHIP CARD — large left column
   ============================================================ */

function FlagshipCard({ p }: { p: ProjectLike }) {
  return (
    <Card interactive padding="none" radius="2xl" className="lg:col-span-8 group overflow-hidden relative">
      <div className="relative aspect-[16/10] img-cinematic">
        <Image
          src={p.img}
          alt={p.title}
          fallback="industrial"
          priority
          className="h-full w-full object-cover img-zoom img-duotone"
        />
      </div>

      {/* Top badges */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <Badge tone="amber" variant="loud">★ Flagship</Badge>
        <Badge tone="white" variant="loud">{p.type}</Badge>
      </div>

      {/* Bottom overlay — clean metric chips */}
      <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <MapPin className="h-3.5 w-3.5" /> {p.loc}
        </div>
        <h3 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{p.title}</h3>

        <div className="mt-5 flex flex-wrap gap-2">
          <MetricChip icon={Zap} label="Capacity" value={p.kw} />
          <MetricChip icon={TrendingUp} label="Annual savings" value={p.savings} highlight />
          <MetricChip label="CO₂ offset" value={p.co2} />
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   SECONDARY CARD — compact right column items
   ============================================================ */

function SecondaryCard({ p }: { p: ProjectLike }) {
  return (
    <Card interactive padding="none" radius="lg" className="group overflow-hidden relative h-full">
      <div className="relative aspect-[16/10] img-cinematic">
        <Image src={p.img} alt={p.title} fallback="residential" className="h-full w-full object-cover img-zoom" />
      </div>
      <div className="absolute top-3 left-3">
        <Badge tone="white" className="text-ink-900">{p.type}</Badge>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
          <MapPin className="h-3 w-3" /> {p.loc}
        </div>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight">{p.title}</h3>
        <div className="mt-2 flex items-center gap-2.5 text-[11px] text-white/85">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Zap className="h-3 w-3 text-amber-300" /> {p.kw}
          </span>
          <span className="text-white/30">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
            <TrendingUp className="h-3 w-3" /> {p.savings}
          </span>
        </div>
      </div>
    </Card>
  );
}

function MetricChip({
  icon: Icon, label, value, highlight,
}: { icon?: any; label: string; value: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur ${
        highlight ? "bg-brand-500/90 border-brand-300/40 text-white" : "bg-white/15 border-white/20 text-white"
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="text-white/70 uppercase tracking-wider text-[10px] hidden sm:inline">{label}:</span>
      <span className="font-extrabold">{value}</span>
    </span>
  );
}
