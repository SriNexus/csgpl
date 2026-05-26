/**
 * StatsBand — premium 5-up KPI strip sitting between Hero and the rest.
 * Clean horizontal cards · equal height · large bold numbers · minimal labels.
 *
 * Used in place of the old crowded trust strip inside Hero.
 */

import { Award, Briefcase, Leaf, Smile, Zap, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
  accent: string;
}

const STATS: Stat[] = [
  { icon: Zap,        value: "5 MW+",  label: "Installed Capacity",  accent: "text-amber-600" },
  { icon: Briefcase,  value: "500+",   label: "Projects Delivered",  accent: "text-brand-600" },
  { icon: Award,      value: "12 M+",  label: "Units Generated / Yr", accent: "text-blue-600" },
  { icon: Leaf,       value: "13 K T", label: "CO₂ Offset / Yr",     accent: "text-emerald-600" },
  { icon: Smile,      value: "4.9 / 5",label: "Customer Rating",     accent: "text-rose-600" },
];

export default function StatsBand() {
  return (
    <Section tone="white" padding="sm" className="border-y hairline">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.label}
              className={`group flex flex-col items-start gap-2 px-5 py-4 rounded-2xl bg-paper border hairline hover:border-brand-300 transition ${
                i === STATS.length - 1 && STATS.length % 2 !== 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <Icon className={`h-5 w-5 ${s.accent}`} />
              <div className="text-2xl md:text-[1.7rem] font-extrabold text-ink-900 tracking-tight leading-none">
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-ink-500">
                {s.label}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
