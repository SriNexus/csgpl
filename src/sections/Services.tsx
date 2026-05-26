/**
 * Services — 4 primary EPC service cards. Premium, scannable, balanced.
 * Replaces the homepage Solutions grid for tighter hierarchy.
 */

import { ArrowUpRight, Building2, Factory, Home, Wallet } from "lucide-react";
import { Section, SectionHeader, Card, Image } from "@/components/ui";
import { Link } from "react-router-dom";

interface Service {
  title: string;
  desc: string;
  href: string;
  image: string;
  accent: string;
  icon: typeof Home;
}

const SERVICES: Service[] = [
  {
    title: "Residential Solar",
    desc: "Subsidy-ready rooftop systems for Indian homes — 1 to 10 kW with net metering and 25-year warranty.",
    href: "/products/solar-panels",
    image: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    accent: "from-amber-400 to-orange-500",
    icon: Home,
  },
  {
    title: "Commercial Solar",
    desc: "Reduce operating costs with grid-tied commercial systems from 10 kW to 1 MW+. Net metering & zero-export.",
    href: "/products/inverters",
    image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    accent: "from-blue-500 to-indigo-600",
    icon: Building2,
  },
  {
    title: "Industrial EPC",
    desc: "MW-scale captive solar plants for factories & MSMEs — from feasibility through O&M.",
    href: "/products/solar-bos",
    image: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    accent: "from-emerald-500 to-teal-600",
    icon: Factory,
  },
  {
    title: "Solar Financing & AMC",
    desc: "Bank financing, government subsidy filing, and lifetime AMC — your project on autopilot.",
    href: "#consultation",
    image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    accent: "from-rose-500 to-pink-600",
    icon: Wallet,
  },
];

export default function Services() {
  return (
    <Section id="services" tone="white" padding="lg">
      <SectionHeader
        eyebrow="What we do"
        title={
          <>
            <span className="serif font-normal text-ink-600">End-to-end EPC</span>{" "}
            <span className="text-gradient-brand">for every project scale.</span>
          </>
        }
        description="From residential rooftops to multi-megawatt industrial plants — one accountable team owns design, supply, installation and lifetime support."
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        {SERVICES.map((s) => <ServiceCard key={s.title} service={s} />)}
      </div>
    </Section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Card interactive padding="none" className="group flex flex-col h-full overflow-hidden">
      <Link to={service.href} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] img-cinematic">
          <Image
            src={service.image}
            alt={service.title}
            fallback="residential"
            className="h-full w-full object-cover img-zoom img-duotone"
          />
          <div className={`absolute top-4 left-4 h-10 w-10 rounded-xl bg-gradient-to-br ${service.accent} text-white grid place-items-center shadow-md`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-extrabold text-ink-900 tracking-tight">{service.title}</h3>
          <p className="mt-2 text-sm text-ink-600 leading-relaxed flex-1">{service.desc}</p>
          <div className="mt-4 pt-4 border-t hairline flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-700 inline-flex items-center gap-1">
              Learn more
            </span>
            <ArrowUpRight className="h-4 w-4 text-ink-400 group-hover:text-brand-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
