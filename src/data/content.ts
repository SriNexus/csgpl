/**
 * Homepage content — hardcoded data extracted from section components.
 * CMS-ready: each export will be progressively swapped for a CMS fetch
 * (Firestore collection) without touching the section JSX.
 */

import {
  Wallet, Plug, Leaf, Wrench, Rocket, PiggyBank,
  Search, PenTool, FileCheck2, HardHat, Activity,
  type LucideIcon,
} from "lucide-react";

/* =========================================================
   HERO
   ========================================================= */
export const heroContent = {
  badge: "India's Trusted Solar EPC Partner",
  headlineParts: {
    line1: "Power your future",
    serif: "smart",
    gradient: "solar energy.",
  },
  description:
    "End-to-end Residential, Commercial & Industrial Solar EPC — engineered with tier-1 components, a 25-year performance guarantee, and white-glove project execution.",
  ctas: {
    primary:   { label: "Get Free Consultation", href: "#consultation" },
    secondary: { label: "Calculate Savings",     href: "#roi" },
    tertiary:  { label: "How it works",          href: "#process" },
  },
  trust: [
    { value: "5MW+",  label: "Installed Capacity" },
    { value: "500+",  label: "Happy Clients" },
    { value: "25 yrs", label: "Performance Warranty" },
  ],
  featuredProject: {
    image: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900",
    secondaryImage: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=240",
    label: "Featured Project",
    title: "12.5 KW Residential — Lucknow",
    metricLabel: "Monthly Bill",
    metricValue: "₹430",
  },
  partners: ["Waaree", "Adani Solar", "Tata Power", "Luminous", "Polycab", "Havells", "Vikram", "Goldi"],
} as const;

/* =========================================================
   WHY GO SOLAR
   ========================================================= */
export type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};
export const whyFeatures: Feature[] = [
  { icon: Plug,      title: "Energy Independence", desc: "Generate clean power on-site. Stay insulated from rising grid tariffs." },
  { icon: Leaf,      title: "Truly Eco-Friendly",  desc: "Offset tonnes of CO₂ every year and accelerate India's green transition." },
  { icon: Wrench,    title: "Low Maintenance",     desc: "Self-cleaning options & 25 yrs of reliable, hassle-free generation." },
  { icon: Rocket,    title: "Fast ROI",            desc: "Typical payback of 3–5 years with subsidies + net metering." },
  { icon: PiggyBank, title: "Long-Term Savings",   desc: "Lock in tariffs today, save lakhs over the next two decades." },
];
export const whyHero = {
  icon: Wallet,
  badge: "Hero Benefit",
  title: "Cut your electricity bills",
  gradient: "by up to 90%",
  desc: "The average CSGPL customer sees their first post-installation bill drop from ₹6,500 to under ₹500. The savings compound — year after year.",
  before: { label: "Before Solar", amount: "₹6,500", unit: "/mo" },
  after:  { label: "After Solar",  amount: "₹430",   unit: "/mo" },
};

/* =========================================================
   SOLUTIONS
   ========================================================= */
export type Solution = {
  title: string;
  desc: string;
  img: string;
  tag: string;
};
export const solutions: Solution[] = [
  { title: "Residential Solar", desc: "Rooftop systems designed for Indian homes — clean, silent & subsidy-ready.", img: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", tag: "Homes" },
  { title: "Commercial Solar", desc: "Reduce opex with commercial-grade rooftop & ground-mount installations.",     img: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", tag: "Business" },
  { title: "Industrial Solar", desc: "MW-scale plants engineered for factories, MSMEs & manufacturing.",             img: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", tag: "Industry" },
  { title: "On-Grid Solar",    desc: "Sell excess power to the grid via net metering — earn while you save.",        img: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", tag: "Grid-Tied" },
  { title: "Off-Grid Solar",   desc: "Total energy independence with solar + battery storage systems.",              img: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", tag: "Standalone" },
  { title: "Hybrid Solar",     desc: "Best of both worlds — grid-tied with seamless backup storage.",                img: "https://images.pexels.com/photos/15751131/pexels-photo-15751131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", tag: "Hybrid" },
];

/* =========================================================
   PRODUCTS
   ========================================================= */
export type Product = {
  title: string;
  icon: LucideIcon;
  tagline: string;
  specs: string[];
  img: string;
  color: string;
};
/**
 * Homepage product preview — derived from the featured catalog so any
 * catalog update reflects on the homepage automatically.
 * See `src/data/productsCatalog.ts` for the canonical product content.
 */
import { featuredProducts, productCategories } from "@/data/productsCatalog";

export const products: Product[] = featuredProducts.map((p, i) => {
  const cat = productCategories.find((c) => c.slug === p.categorySlug)!;
  const colors = [
    "from-amber-400 to-orange-500",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-fuchsia-600",
    "from-rose-500 to-pink-600",
  ];
  return {
    title:   p.title,
    icon:    cat.icon,
    tagline: p.technology,
    specs:   p.highlights.slice(0, 3).map((h) => h.replace(/^[A-Z]/, (c) => c.toUpperCase())),
    img:     p.image,
    color:   colors[i % colors.length],
  };
});

/* =========================================================
   ROI & SAVINGS
   ========================================================= */
export type RoiRow = {
  size: string;
  monthly: number;
  yearly: number;
  roi: string;
  area: string;
  popular?: boolean;
};
export const roiRows: RoiRow[] = [
  { size: "1 KW",  monthly: 1200,  yearly: 14400,  roi: "4.5 yrs", area: "70 sq.ft" },
  { size: "3 KW",  monthly: 3600,  yearly: 43200,  roi: "4 yrs",   area: "210 sq.ft" },
  { size: "5 KW",  monthly: 6000,  yearly: 72000,  roi: "3.8 yrs", area: "350 sq.ft", popular: true },
  { size: "10 KW", monthly: 12000, yearly: 144000, roi: "3.5 yrs", area: "700 sq.ft" },
  { size: "25 KW", monthly: 30000, yearly: 360000, roi: "3.2 yrs", area: "1750 sq.ft" },
  { size: "50 KW", monthly: 60000, yearly: 720000, roi: "3 yrs",   area: "3500 sq.ft" },
];

/* =========================================================
   PROCESS
   ========================================================= */
export type ProcessStep = {
  icon: LucideIcon;
  title: string;
  desc: string;
  meta: string;
};
export const processSteps: ProcessStep[] = [
  { icon: Search,     title: "Site Survey",            desc: "On-site assessment of roof, shadow & load. Typically 1 day.", meta: "Day 1" },
  { icon: PenTool,    title: "Design & Engineering",   desc: "Custom system design optimised for max generation & ROI.",     meta: "Day 2-3" },
  { icon: FileCheck2, title: "Approvals & Subsidy",    desc: "We handle DISCOM net metering & PM-Surya-Ghar subsidy filing.", meta: "Day 4-15" },
  { icon: HardHat,    title: "Installation",           desc: "Certified installers, premium components, safety-first execution.", meta: "Day 16-22" },
  { icon: Activity,   title: "Monitoring & Care",      desc: "Smart app monitoring + 25 yrs of AMC, service & support.",     meta: "Lifetime" },
];

/* =========================================================
   PROJECTS
   ========================================================= */
export type Project = {
  title: string;
  loc: string;
  kw: string;
  savings: string;
  co2: string;
  img: string;
  type: string;
};
export const projects: Project[] = [
  { title: "Manufacturing Factory", loc: "Noida, Uttar Pradesh", kw: "500 KW", savings: "₹60L / yr", co2: "650 tonnes CO₂", img: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", type: "Industrial" },
  { title: "Residential Villa",     loc: "Lucknow, UP",          kw: "8 KW",   savings: "₹96K / yr", co2: "10 tonnes CO₂",  img: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",  type: "Residential" },
  { title: "Warehouse Solar Plant", loc: "Varanasi, UP",         kw: "150 KW", savings: "₹18L / yr", co2: "195 tonnes CO₂", img: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900", type: "Commercial" },
  { title: "Industrial Rooftop",    loc: "Kanpur, UP",           kw: "250 KW", savings: "₹28L / yr", co2: "325 tonnes CO₂", img: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900", type: "Industrial" },
];

/* =========================================================
   TESTIMONIALS
   ========================================================= */
export type Testimonial = {
  name: string;
  role: string;
  system: string;
  text: string;
  rating: number;
};
export const testimonials: Testimonial[] = [
  { name: "Rajesh Kumar",       role: "Homeowner • Lucknow",            system: "5 KW Residential",   rating: 5,
    text: "From ₹6,500 to ₹450 — that's our electricity bill before and after CSGPL. The whole installation took just 4 days, and the team handled all paperwork." },
  { name: "Priya Sharma",       role: "Director • Sharma Industries",   system: "200 KW Industrial",  rating: 5,
    text: "We installed 200KW for our factory. Fast execution, transparent BOQ, and the monitoring app is exceptional. ROI tracking under 4 years." },
  { name: "Mohammed Faisal",    role: "Hotel Owner • Varanasi",         system: "75 KW Commercial",   rating: 5,
    text: "End-to-end from survey to subsidy. The team handled DISCOM paperwork — truly hassle-free." },
  { name: "Anita Mehta",        role: "Society Secretary • Noida",      system: "60 KW Society",      rating: 5,
    text: "Common-area bills reduced by 80%. Premium components, polite team, great after-sales." },
];

/* =========================================================
   CONSULTATION FORM
   ========================================================= */
export const consultationOptions = {
  systemTypes: [
    "Residential (1-10 KW)",
    "Commercial (10-100 KW)",
    "Industrial (100 KW+)",
    "On-Grid System",
    "Off-Grid System",
    "Hybrid System",
  ],
  billRanges: [
    "Under ₹1,500",
    "₹1,500 – ₹3,000",
    "₹3,000 – ₹6,000",
    "₹6,000 – ₹15,000",
    "₹15,000 – ₹50,000",
    "₹50,000+",
  ],
};

/* =========================================================
   FAQ
   ========================================================= */
export type Faq = { q: string; a: string };
export const faqs: Faq[] = [
  { q: "How much does a rooftop solar system cost in India?", a: "A typical 5KW residential system costs around ₹2.5–3.5 lakhs before subsidy. After government subsidy (up to 40%), your effective cost can drop to ₹1.5–2 lakhs." },
  { q: "How long does installation take?",                    a: "Standard residential systems (3-10KW) are installed in 3–7 days. Larger commercial/industrial systems take 2–6 weeks depending on size, design & approvals." },
  { q: "Is government subsidy available?",                    a: "Yes. Residential systems are eligible for up to 40% subsidy under the PM Surya Ghar Muft Bijli Yojana. We assist with the entire application process." },
  { q: "What is the payback period?",                         a: "Most rooftop systems pay back in just 3–5 years through bill savings. After that, you get 20+ more years of nearly free electricity." },
  { q: "Do solar panels work during cloudy weather or monsoon?", a: "Yes, but at reduced output (~25-40% of peak). On-grid systems automatically draw from the grid during low generation, ensuring zero downtime." },
  { q: "What kind of maintenance is needed?",                 a: "Very minimal — just cleaning the panels every 2-3 months and an annual professional check. We also offer comprehensive AMC packages." },
  { q: "What warranty do I get?",                             a: "25-year linear performance warranty on panels, 5–10 years on inverters, and 1 year on installation workmanship — extendable through our AMC." },
];
