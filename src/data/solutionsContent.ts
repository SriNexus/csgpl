/**
 * Solar Solution page content — Residential / Commercial / Industrial.
 *
 * One typed config per vertical; the shared SolutionPage template renders
 * all three identically with different copy + accent colours.
 */

import {
  Building2, Factory, Home, IndianRupee, Leaf, Receipt, Settings2, ShieldCheck,
  Sun, TrendingUp, Wallet, Zap, Battery, BarChart3, Banknote, Award,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export type SolutionSlug =
  | "residential" | "commercial" | "industrial"
  | "on-grid" | "off-grid" | "hybrid";

export interface SolutionHero {
  badge: string;
  headline: { line1: string; serif: string; gradient: string };
  description: string;
  highlights: { icon: LucideIcon; label: string }[];
  primaryCta:   { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  floatingKpi: { value: string; label: string; accent: string };
}

export interface SolutionBenefit {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface RoiCard {
  label: string;
  value: string;
  hint: string;
  accent: "brand" | "amber" | "emerald" | "blue";
}

export interface FinancingItem {
  icon: LucideIcon;
  badge: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

export interface ProjectShowcase {
  title: string;
  location: string;
  size: string;
  output: string;
  type: string;
  image: string;
}

export interface SolutionFaq { q: string; a: string }

export interface SolutionConfig {
  slug: SolutionSlug;
  category: { name: string; icon: LucideIcon };
  /** Accent gradient used in eyebrows + numbered chips + hero overlays. */
  accent: { from: string; to: string };
  seo: { title: string; description: string };
  hero: SolutionHero;
  benefits: SolutionBenefit[];
  howItWorks: { intro: string; steps: { title: string; body: string }[] };
  roi: { intro: string; cards: RoiCard[] };
  financing: FinancingItem[];
  whyChooseUs: { icon: LucideIcon; title: string; body: string }[];
  productEcosystem: { brand: string; category: string; href: string }[];
  projects: { featured: ProjectShowcase; others: ProjectShowcase[] };
  consultation: { title: string; subtitle: string; bullets: string[] };
  faqs: SolutionFaq[];
  finalCta: { title: string; description: string };
}

/* ============================================================
   SHARED — installation process (same for all verticals)
   ============================================================ */

export const INSTALL_PROCESS = [
  { title: "Consultation",          body: "Free expert call · understand your needs" },
  { title: "Site Survey",           body: "On-site shadow analysis & load assessment" },
  { title: "Custom Design",         body: "Engineering-grade BOQ + DISCOM approval" },
  { title: "Installation",          body: "Certified installers · 3–14 day deployment" },
  { title: "Net Metering",          body: "Activation + meter changeover + go-live" },
  { title: "Support & Monitoring",  body: "App monitoring + AMC + 25-yr support" },
];

/* ============================================================
   PRODUCT ECOSYSTEM — shared across verticals
   ============================================================ */

const PRODUCT_ECOSYSTEM = [
  { brand: "Emmvee",          category: "Solar Panels",   href: "/products/solar-panels/emmvee-titanium-duo-530-625wp" },
  { brand: "Feston EnGield",  category: "On-Grid Inverters", href: "/products/inverters/feston-engield-on-grid-1.5kw-25kw" },
  { brand: "Feston Vega",     category: "Hybrid + Battery", href: "/products/inverters/feston-vega-hybrid-3kw-20kw" },
  { brand: "TATA · Apollo",   category: "GI Mounting",    href: "/products/solar-bos/gi-solar-mounting-structures" },
  { brand: "MC4 / IEC 62852", category: "Accessories",    href: "/products/accessories/mc4-solar-connectors-ip67-ip68" },
];

/* ============================================================
   RESIDENTIAL
   ============================================================ */

export const RESIDENTIAL: SolutionConfig = {
  slug: "residential",
  category: { name: "Residential Solar", icon: Home },
  accent:   { from: "from-amber-400", to: "to-orange-500" },

  seo: {
    title: "Residential Solar EPC · Rooftop Solar for Homes | CSGPL",
    description:
      "Premium rooftop solar systems for Indian homes — subsidy-ready, net-metered, 25-year warranty. End-to-end EPC from CSGPL.",
  },

  hero: {
    badge: "Residential Rooftop Solar",
    headline: { line1: "Power your home", serif: "with", gradient: "smart solar energy." },
    description:
      "Subsidy-ready rooftop solar systems engineered for Indian homes — tier-1 components, net-metered, and a 25-year performance guarantee.",
    highlights: [
      { icon: TrendingUp,  label: "Up to 90% bill savings" },
      { icon: ShieldCheck, label: "25-year warranty" },
      { icon: Banknote,    label: "PM Surya Ghar subsidy" },
      { icon: Zap,         label: "Net metering ready" },
    ],
    primaryCta:   { label: "Get Free Consultation", href: "/#consultation" },
    secondaryCta: { label: "Calculate Savings",     href: "/#roi" },
    image: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "90%", label: "Avg. bill reduction", accent: "from-brand-500 to-brand-700" },
  },

  benefits: [
    { icon: Wallet,     title: "Lower Electricity Bills",  body: "Cut monthly bills by up to 90% from day one — savings compound over 25 years." },
    { icon: Leaf,       title: "Eco-Friendly Energy",      body: "Offset tonnes of CO₂ per year and contribute to India's clean energy transition." },
    { icon: Battery,    title: "Backup Reliability",       body: "Hybrid systems keep critical loads running through power cuts and outages." },
    { icon: Award,      title: "Property Value Increase",  body: "Solar-equipped homes resell faster and command a measurable price premium." },
  ],

  howItWorks: {
    intro: "Your rooftop becomes a 25-year energy asset. Here's the flow — from sunlight to your meter.",
    steps: [
      { title: "Solar panels generate DC power",  body: "Tier-1 N-Type TOPCon modules capture sunlight and produce DC electricity." },
      { title: "Inverter converts DC to AC",       body: "High-efficiency string inverter converts and synchronises with your home grid." },
      { title: "Your home consumes solar first",   body: "Appliances draw from solar before the grid — instant bill reduction." },
      { title: "Export surplus via net metering",  body: "Extra units flow back to the grid as credits offsetting future bills." },
    ],
  },

  roi: {
    intro: "Real residential numbers across India — your custom estimate inside 24 hours.",
    cards: [
      { label: "Monthly savings (5 kW)",  value: "₹6,000",   hint: "₹72,000 / year · most popular size",                 accent: "brand" },
      { label: "PM Surya Ghar subsidy",   value: "Up to ₹78K",hint: "Direct CFA into your bank · we handle filing",        accent: "amber" },
      { label: "Typical payback",         value: "3–5 yrs",   hint: "Then 20+ years of nearly free electricity",          accent: "emerald" },
      { label: "25-yr lifetime savings",  value: "₹15 L+",    hint: "Indicative for a 5 kW residential system",            accent: "blue" },
    ],
  },

  financing: [
    {
      icon: Banknote, badge: "Central Subsidy",
      title: "PM Surya Ghar — Muft Bijli Yojana",
      body:
        "Up to ₹78,000 direct subsidy for residential rooftops. CSGPL handles end-to-end filing — National Portal registration, DISCOM feasibility and disbursal tracking.",
      cta: { label: "Check eligibility", href: "/#consultation" },
    },
    {
      icon: IndianRupee, badge: "Easy Financing",
      title: "₹0 down EMI options",
      body:
        "Partner bank financing converts your CAPEX into a manageable EMI — often lower than your existing electricity bill. Documentation support included.",
      cta: { label: "See EMI plans", href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "Experienced EPC Team",   body: "Two decades of energy engineering · 15,000+ installs · single project manager per site." },
    { icon: Sun,         title: "Premium Products",       body: "Emmvee panels · Feston inverters · GI structures · MC4 — every component tier-1." },
    { icon: Settings2,   title: "End-to-End Execution",   body: "Survey · design · supply · install · DISCOM filing · net metering · AMC — one contract." },
    { icon: Award,       title: "Certified Installers",   body: "MNRE-trained installers, safety-first execution, every joint inspected and signed off." },
    { icon: BarChart3,   title: "Strong After-Sales",     body: "Smart app monitoring · 25-yr support · rapid on-site response for any issue." },
    { icon: Zap,         title: "Trusted Technology",     body: "BIS-certified, ALMM-listed components engineered for Indian climate and grid conditions." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Premium Villa Rooftop", location: "Lucknow, UP",
      size: "12.5 kW", output: "16,500 units / yr", type: "Residential",
      image: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Independent House",     location: "Varanasi, UP", size: "5 kW",  output: "6,500 units / yr",  type: "Residential",
        image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Bungalow Rooftop",      location: "Kanpur, UP",   size: "8 kW",  output: "10,400 units / yr", type: "Residential",
        image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Apartment Common Area", location: "Noida, UP",    size: "20 kW", output: "26,000 units / yr", type: "Residential",
        image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Get your free residential solar quote",
    subtitle: "A 60-second form · solar expert call within 24 hours · transparent BOQ with subsidy already deducted.",
    bullets: [
      "Free site survey & shadow analysis",
      "PM Surya Ghar subsidy filed by us",
      "EMI & financing options arranged",
      "25-yr performance warranty included",
    ],
  },

  faqs: [
    { q: "How much subsidy will I actually receive?",                   a: "Residential rooftops up to 3 kW receive ₹30,000/kW. 3 kW onwards caps at ₹78,000. We handle the entire application & disbursal tracking." },
    { q: "Will solar work during a power cut?",                          a: "Standard on-grid systems shut off for safety. Hybrid systems with batteries keep critical loads running. We help you choose based on your outage frequency." },
    { q: "What maintenance does a rooftop system need?",                 a: "Quarterly panel cleaning and an annual professional check — typically under ₹3,000/year. We offer AMC plans for hands-off ownership." },
    { q: "How long does installation take?",                             a: "Standard 3–10 kW residential systems are installed in 3–7 days. DISCOM net-metering activation adds 2–4 weeks." },
    { q: "Will solar increase my property value?",                       a: "Yes — research and real-world resales show solar-equipped homes sell faster and at a premium. The 25-year warranty transfers to the new owner." },
    { q: "What if my electricity needs grow in the future?",             a: "Modular systems are easy to expand. We design with future expansion in mind — typically adding capacity is straightforward and the inverter often has headroom." },
  ],

  finalCta: {
    title: "Start saving with solar today.",
    description: "Free site survey · custom proposal in 24 hours · PM Surya Ghar subsidy and financing handled.",
  },
};

/* ============================================================
   COMMERCIAL
   ============================================================ */

export const COMMERCIAL: SolutionConfig = {
  slug: "commercial",
  category: { name: "Commercial Solar", icon: Building2 },
  accent:   { from: "from-blue-500", to: "to-indigo-600" },

  seo: {
    title: "Commercial Solar EPC · Rooftop Solar for Business | CSGPL",
    description:
      "Reduce business energy costs with commercial-grade solar EPC — 10 kW to 1 MW+ rooftop & ground-mount, accelerated depreciation, net metering & zero-export.",
  },

  hero: {
    badge: "Commercial Rooftop Solar",
    headline: { line1: "Reduce business energy costs", serif: "with", gradient: "commercial solar." },
    description:
      "Premium commercial solar EPC for offices, retail, hospitality and institutions — 10 kW to 1 MW+ rooftop & ground-mount systems with full DISCOM support.",
    highlights: [
      { icon: TrendingUp,  label: "30–60% opex reduction" },
      { icon: Receipt,     label: "40% accelerated depreciation" },
      { icon: Zap,         label: "Net metering & zero-export" },
      { icon: ShieldCheck, label: "25-yr performance warranty" },
    ],
    primaryCta:   { label: "Request Commercial Quote", href: "/#consultation" },
    secondaryCta: { label: "Talk to an Expert",        href: "tel:+919305806938" },
    image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "₹60L+", label: "Avg. 5-yr savings (100 kW)", accent: "from-blue-500 to-indigo-600" },
  },

  benefits: [
    { icon: TrendingUp,  title: "Operational Savings",     body: "Slash energy opex by 30–60%. Most commercial systems pay back in under 4 years." },
    { icon: Receipt,     title: "Tax Benefits",            body: "Claim 40% accelerated depreciation in year one + GST input credits on the CAPEX." },
    { icon: ShieldCheck, title: "Energy Independence",     body: "Hedge against tariff hikes for the next 25 years — predictable energy costs on your P&L." },
    { icon: Settings2,   title: "Scalable Systems",        body: "Start with what you need, expand as you grow. Phased CAPEX, single-system architecture." },
  ],

  howItWorks: {
    intro: "Commercial solar pays for itself faster than almost any capex you can deploy. Here's the flow.",
    steps: [
      { title: "Rooftop or ground-mount array",   body: "Tier-1 modules sized to your monthly load · GI structures engineered to your roof type." },
      { title: "Three-phase string inverters",     body: "Feston EnGield 4–25 kW string inverters with 98.6% efficiency and zero-export support." },
      { title: "Operations consume solar-first",   body: "Lighting, HVAC, machinery and IT loads draw from solar before grid — instant opex drop." },
      { title: "Net metering or zero-export",      body: "Sell surplus to the DISCOM via net metering, or run zero-export where regulations require." },
    ],
  },

  roi: {
    intro: "Indicative commercial economics — exact numbers depend on tariff slab, load profile and roof orientation.",
    cards: [
      { label: "Yearly savings (100 kW)",   value: "₹12 L+",   hint: "On typical commercial tariff of ₹9–11 / unit",   accent: "brand" },
      { label: "Accelerated depreciation",  value: "40% Y1",   hint: "Tax shield · MNRE-approved",                       accent: "amber" },
      { label: "Typical payback",            value: "3.2 yrs",  hint: "For a 100 kW C&I rooftop system",                  accent: "emerald" },
      { label: "25-yr lifetime savings",     value: "₹3.5 Cr+", hint: "For a 100 kW system on commercial tariff",         accent: "blue" },
    ],
  },

  financing: [
    {
      icon: Receipt, badge: "Tax Benefit",
      title: "Accelerated Depreciation (Sec. 32)",
      body:
        "Claim 40% accelerated depreciation in year one — an immediate tax shield on the entire system CAPEX. GST input credits further reduce effective cost.",
      cta: { label: "Get a depreciation model", href: "/#consultation" },
    },
    {
      icon: IndianRupee, badge: "CAPEX / OPEX",
      title: "CAPEX, EMI or RESCO models",
      body:
        "Own the system (CAPEX), spread the cost via partner-bank EMI, or sign a RESCO/PPA where we own + operate and you only pay for the units consumed.",
      cta: { label: "Compare models",            href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "Experienced EPC Team",   body: "Engineering-led commercial deployments · single accountable project manager · transparent BOQ." },
    { icon: Sun,         title: "Premium Components",     body: "Emmvee TOPCon panels · Feston three-phase inverters · TATA/Apollo GI structures." },
    { icon: Settings2,   title: "End-to-End Execution",   body: "Survey · design · DISCOM filing · zero-export config · commissioning · AMC — one contract." },
    { icon: Award,       title: "Certified Installers",   body: "MNRE-trained crews · safety-first execution · earthing & lightning protection to spec." },
    { icon: BarChart3,   title: "Live Monitoring",        body: "Plant-level monitoring dashboard · alert thresholds · response SLAs for downtime events." },
    { icon: Zap,         title: "DISCOM Expertise",       body: "Net metering filing · zero-export commissioning · CEA compliance · feeder synchronisation." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Office Complex Rooftop", location: "Noida, UP",
      size: "150 kW", output: "₹18 L savings / yr", type: "Commercial",
      image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Retail Showroom",  location: "Varanasi, UP", size: "75 kW",  output: "₹9 L / yr",   type: "Commercial",
        image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Boutique Hotel",   location: "Lucknow, UP",  size: "50 kW",  output: "₹6.2 L / yr", type: "Commercial",
        image: "https://images.pexels.com/photos/15751131/pexels-photo-15751131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "School Campus",    location: "Kanpur, UP",   size: "120 kW", output: "₹14 L / yr",  type: "Commercial",
        image: "https://images.pexels.com/photos/9799706/pexels-photo-9799706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Get your commercial solar proposal",
    subtitle: "Full 25-year financial model · accelerated depreciation analysis · DISCOM feasibility — delivered in 48 hours.",
    bullets: [
      "Free site survey & roof load report",
      "Detailed CAPEX / OPEX / RESCO comparison",
      "Accelerated-depreciation tax model",
      "DISCOM net-metering & zero-export filing included",
    ],
  },

  faqs: [
    { q: "What tax benefits does my business get?",                       a: "40% accelerated depreciation in year one (Section 32) + GST input credit on the system. Combined effective CAPEX drops 30–40% post-tax." },
    { q: "Can I run zero-export for DISCOM compliance?",                  a: "Yes — Feston EnGield inverters support native zero-export. We commission with the DISCOM and provide the compliance certificate." },
    { q: "What's the typical payback for commercial solar?",              a: "Most C&I rooftops pay back in 3–4 years. After that, you get 20+ years of nearly free electricity on a 25-year warranty." },
    { q: "Can I scale the system later?",                                  a: "Yes — we design with future expansion in mind. Adding capacity is straightforward and the inverter ecosystem supports parallel scaling." },
    { q: "What about ground-mount or carport systems?",                    a: "We design and install ground-mount and solar carport systems for facilities with available open land or covered parking." },
    { q: "Do you offer RESCO / OPEX models?",                              a: "Yes — for qualifying installations we offer a RESCO model where you pay only for the units consumed and we own/operate the asset." },
  ],

  finalCta: {
    title: "Power your business smarter.",
    description: "Free site assessment · 48-hour proposal · full tax + financing model included.",
  },
};

/* ============================================================
   INDUSTRIAL
   ============================================================ */

export const INDUSTRIAL: SolutionConfig = {
  slug: "industrial",
  category: { name: "Industrial Solar EPC", icon: Factory },
  accent:   { from: "from-emerald-500", to: "to-teal-600" },

  seo: {
    title: "Industrial Solar EPC · MW-Scale Solar for Manufacturing | CSGPL",
    description:
      "Scale industrial operations with high-capacity solar EPC — 100 kW to multi-MW captive plants for factories, MSMEs and utilities. Custom engineering & PPA models.",
  },

  hero: {
    badge: "Industrial Solar EPC",
    headline: { line1: "Scale industrial operations", serif: "with", gradient: "high-capacity solar." },
    description:
      "End-to-end industrial solar EPC — 100 kW to multi-megawatt captive plants for factories, MSMEs, manufacturing and utility-scale projects.",
    highlights: [
      { icon: Factory,     label: "100 kW to multi-MW" },
      { icon: BarChart3,   label: "Peak load optimisation" },
      { icon: Leaf,        label: "ESG & sustainability goals" },
      { icon: Settings2,   label: "Custom EPC engineering" },
    ],
    primaryCta:   { label: "Request Industrial Quote", href: "/#consultation" },
    secondaryCta: { label: "Talk to Industrial Lead",  href: "tel:+919305806938" },
    image: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "MW+", label: "Captive plants delivered", accent: "from-emerald-500 to-teal-600" },
  },

  benefits: [
    { icon: TrendingUp,  title: "Reduce Operational Cost",  body: "Cut industrial energy spend by 30–50% with captive solar — and lock the savings for 25 years." },
    { icon: BarChart3,   title: "Peak Load Optimisation",   body: "Match solar generation to peak production hours — reduce demand-charge exposure substantially." },
    { icon: Factory,     title: "High-Capacity Systems",    body: "100 kW to multi-MW captive plants engineered for industrial duty cycles and uptime." },
    { icon: Leaf,        title: "ESG & Sustainability",     body: "Quantifiable Scope-2 emission reduction · supports BRSR reporting and customer ESG mandates." },
  ],

  howItWorks: {
    intro: "Industrial solar is an asset class — engineered for 25-year operational reliability and predictable returns.",
    steps: [
      { title: "Large-format module arrays",       body: "Bifacial TOPCon panels on engineered GI structures — designed for industrial wind loads and uptime." },
      { title: "Central or string inverters",      body: "Inverter topology matched to plant size — string for distributed reliability, central for utility scale." },
      { title: "Captive consumption & wheeling",   body: "Solar powers production lines directly; surplus wheeled across discom or banked per state policy." },
      { title: "Continuous monitoring & O&M",      body: "Plant-level SCADA · uptime SLAs · scheduled cleaning · annual performance audits." },
    ],
  },

  roi: {
    intro: "Industrial economics are projected over a 25-year asset lifecycle — every CSGPL proposal includes a full DCF model.",
    cards: [
      { label: "Yearly savings (500 kW)",  value: "₹60 L+",   hint: "On industrial tariff ₹9–13 / unit",      accent: "brand" },
      { label: "Accelerated depreciation", value: "40% Y1",   hint: "+ GST input credit",                     accent: "amber" },
      { label: "Typical payback",           value: "3 yrs",    hint: "For 500 kW industrial rooftop",          accent: "emerald" },
      { label: "Project IRR",               value: "22–28%",   hint: "On CAPEX over 25-yr lifecycle",          accent: "blue" },
    ],
  },

  financing: [
    {
      icon: IndianRupee, badge: "Financing",
      title: "PPA / RESCO models",
      body:
        "Sign a Power Purchase Agreement — CSGPL or partner finances, owns and operates the plant; you pay only a fixed ₹/unit, typically below your current tariff.",
      cta: { label: "Discuss PPA terms", href: "/#consultation" },
    },
    {
      icon: Settings2, badge: "EPC Partnership",
      title: "Turn-key EPC engagements",
      body:
        "Full responsibility — feasibility, design, supply, civils, electricals, commissioning and long-term O&M. Single accountable contract for industrial owners.",
      cta: { label: "EPC capability statement", href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "Experienced EPC Team",     body: "Two decades in industrial power engineering · execution discipline · safety-first culture." },
    { icon: Sun,         title: "Premium Components",       body: "Emmvee / Jakson / RenewSys panels · Feston three-phase · TATA/Apollo HDG structures." },
    { icon: Settings2,   title: "End-to-End Execution",     body: "Feasibility · DCF model · design · supply · civils · commissioning · O&M — one contract." },
    { icon: Award,       title: "Certified Installers",     body: "MNRE-approved · OSHA-trained crews · earthing & lightning protection engineered per project." },
    { icon: BarChart3,   title: "SCADA & Monitoring",       body: "Plant-level SCADA · uptime SLAs · alert escalation · monthly performance reports." },
    { icon: Zap,         title: "Custom Engineering",       body: "Wind-load engineered structures · hot-dip galvanisation for coastal/industrial zones." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Manufacturing Captive Plant", location: "Noida, UP",
      size: "500 kW", output: "₹60 L savings / yr", type: "Industrial",
      image: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Industrial Rooftop",   location: "Kanpur, UP",   size: "250 kW", output: "₹28 L / yr", type: "Industrial",
        image: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Warehouse Solar Plant",location: "Varanasi, UP", size: "150 kW", output: "₹18 L / yr", type: "Industrial",
        image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "MSME Captive Plant",   location: "Lucknow, UP",  size: "300 kW", output: "₹36 L / yr", type: "Industrial",
        image: "https://images.pexels.com/photos/15751131/pexels-photo-15751131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Request an industrial solar proposal",
    subtitle: "DCF model · structural & electrical engineering · PPA / EPC commercial framework — delivered within 5 working days.",
    bullets: [
      "Site engineering survey (structural + electrical)",
      "25-yr DCF model with IRR & sensitivity analysis",
      "PPA / EPC commercial framework",
      "Project commissioning + long-term O&M plan",
    ],
  },

  faqs: [
    { q: "What's the smallest industrial plant you deploy?",              a: "We typically engage from 100 kW upward. For smaller industrial loads, our Commercial Solar offering may be a better fit." },
    { q: "Do you handle structural engineering for industrial roofs?",    a: "Yes — we engineer mounting structures for the roof type, wind load (per IS 875) and panel layout. Coastal/industrial sites use hot-dip galvanised structures." },
    { q: "Can you offer a PPA model where you finance the plant?",        a: "Yes — for qualifying installations we offer PPA / RESCO models. You pay only ₹/unit; we finance, own and operate the asset for 15–25 years." },
    { q: "How do you handle peak demand and load shifting?",              a: "Our design phase profiles your load against solar generation curves. Where useful, we recommend battery storage to shift peak load and reduce demand charges." },
    { q: "What about ESG reporting and BRSR compliance?",                 a: "Every operational plant includes verifiable generation reports usable for Scope-2 emission reduction in BRSR and customer ESG disclosures." },
    { q: "What's the typical project execution timeline?",                a: "100–500 kW industrial rooftops: 4–8 weeks from PO. MW-scale ground-mount: 3–6 months including civils, commissioning and grid synchronisation." },
  ],

  finalCta: {
    title: "Scale sustainably with industrial solar.",
    description: "Engineering-led, capital-efficient industrial solar — engaged on EPC or PPA terms.",
  },
};

/* ============================================================
   ON-GRID — Net-metered grid-tied systems
   ============================================================ */

export const ON_GRID: SolutionConfig = {
  slug: "on-grid",
  category: { name: "On-Grid Solar System", icon: Zap },
  accent:   { from: "from-blue-500", to: "to-cyan-500" },

  seo: {
    title: "On-Grid Solar System · Net Metering & Grid-Tied EPC | CSGPL",
    description:
      "On-grid solar systems with net metering — sell surplus electricity back to the grid. Premium EPC for homes & businesses · Feston EnGield inverters · 25-yr warranty.",
  },

  hero: {
    badge: "On-Grid Solar System",
    headline: { line1: "Sell surplus power", serif: "with", gradient: "net-metered solar." },
    description:
      "Grid-tied solar systems that power your premises during the day and export surplus to the grid via net metering — every extra unit credited against future bills.",
    highlights: [
      { icon: Zap,         label: "Net metering credits" },
      { icon: TrendingUp,  label: "Lowest CAPEX option" },
      { icon: ShieldCheck, label: "Zero-export ready" },
      { icon: Award,       label: "DISCOM-approved" },
    ],
    primaryCta:   { label: "Get Free Consultation", href: "/#consultation" },
    secondaryCta: { label: "Calculate Savings",     href: "/#roi" },
    image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "98.6%", label: "Inverter peak efficiency", accent: "from-blue-500 to-cyan-500" },
  },

  benefits: [
    { icon: Wallet,     title: "Lowest Upfront Cost",      body: "No batteries means lowest CAPEX per kW — fastest payback of any solar architecture." },
    { icon: IndianRupee,title: "Net Metering Credits",      body: "Every surplus unit exported earns a credit, offsetting future bills automatically." },
    { icon: Settings2,  title: "Low Maintenance",          body: "Fewer components, no battery upkeep — the simplest solar system to live with." },
    { icon: Zap,         title: "Grid Sync & Safety",       body: "Anti-islanding & DISCOM-compliant — system shuts off safely during grid failures." },
  ],

  howItWorks: {
    intro: "On-grid systems use the utility as a giant virtual battery — you sell when you have surplus, buy when you need more.",
    steps: [
      { title: "Modules generate DC power",       body: "Tier-1 panels capture sunlight and produce DC during daylight hours." },
      { title: "String inverter converts to AC",   body: "Feston EnGield string inverter syncs to grid voltage & frequency at 98.6% efficiency." },
      { title: "Loads consume solar first",        body: "Your appliances draw from solar before grid — direct bill reduction." },
      { title: "Surplus exported via net meter",   body: "Bi-directional meter records exported units · DISCOM credits against future bills." },
    ],
  },

  roi: {
    intro: "On-grid is the lowest CAPEX path — fastest payback because every component goes to generation, not storage.",
    cards: [
      { label: "Monthly savings (5 kW)",  value: "₹6,000",   hint: "Net metering ensures 100% offset",            accent: "brand" },
      { label: "CAPEX / kW",              value: "₹55–65K",  hint: "Lowest among all solar architectures",        accent: "blue" },
      { label: "Typical payback",         value: "3–4 yrs",  hint: "Fastest payback of any solar system",         accent: "emerald" },
      { label: "Net metering credit",     value: "₹/unit",   hint: "DISCOM tariff (varies by state)",             accent: "amber" },
    ],
  },

  financing: [
    {
      icon: Zap, badge: "Grid Integration",
      title: "Net Metering Application",
      body:
        "CSGPL handles the complete DISCOM net-metering application — feasibility study, bi-directional meter installation, technical approval and grid synchronisation certificate.",
      cta: { label: "Start the application", href: "/#consultation" },
    },
    {
      icon: ShieldCheck, badge: "Compliance",
      title: "Zero-Export Configuration",
      body:
        "For DISCOMs that restrict export (or commercial connections with restrictions), Feston EnGield supports native zero-export. We configure & certify compliance.",
      cta: { label: "Discuss compliance", href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "DISCOM Expertise",      body: "Net-metering filing · zero-export commissioning · CEA compliance · feeder synchronisation done in-house." },
    { icon: Sun,         title: "Premium Inverters",     body: "Feston EnGield single & three-phase string inverters · 98.6% peak efficiency · 10-year warranty." },
    { icon: Settings2,   title: "End-to-End EPC",        body: "Survey · design · supply · install · DISCOM filing · activation · AMC — one accountable contract." },
    { icon: Award,       title: "Certified Installers",  body: "MNRE-trained installers · safety-first execution · every joint inspected and signed off." },
    { icon: BarChart3,   title: "Smart Monitoring",      body: "Wi-Fi / LAN monitoring app — track generation, export & savings live from your phone." },
    { icon: Zap,         title: "Trusted Technology",    body: "BIS-certified, ALMM-listed components engineered for Indian climate and grid conditions." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Net-Metered Residential", location: "Lucknow, UP",
      size: "10 kW", output: "13,000 units / yr · ~40% exported", type: "On-Grid",
      image: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Showroom Grid-Tied",   location: "Varanasi, UP", size: "30 kW",  output: "39,000 units / yr",  type: "On-Grid",
        image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "School Net-Metered",   location: "Kanpur, UP",   size: "75 kW",  output: "97,500 units / yr",  type: "On-Grid",
        image: "https://images.pexels.com/photos/9799706/pexels-photo-9799706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Office Zero-Export",   location: "Noida, UP",    size: "50 kW",  output: "65,000 units / yr",  type: "On-Grid",
        image: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Get your on-grid solar quote",
    subtitle: "Free site survey · DISCOM feasibility check · transparent BOQ · net-metering filing handled end-to-end.",
    bullets: [
      "Free site & shadow analysis",
      "DISCOM net-metering feasibility check",
      "Zero-export configuration where needed",
      "25-year performance warranty included",
    ],
  },

  faqs: [
    { q: "How does net metering work?",                          a: "A bi-directional meter records both the units you draw from the grid and the units you export. At billing, you're charged only for the net consumption (units drawn minus units exported)." },
    { q: "Will the system work during a power cut?",             a: "No — on-grid systems shut down during grid failures for installer safety (anti-islanding). If outages are frequent, consider a hybrid system with battery backup." },
    { q: "What's the difference between net metering and zero-export?", a: "Net metering credits exported units against your bill. Zero-export prevents any export — required by some DISCOMs/commercial connections. We support both." },
    { q: "How long does DISCOM approval take?",                  a: "Typical timeline: 2–4 weeks from application submission to bi-directional meter installation, depending on your DISCOM and load category." },
    { q: "Can I upgrade to hybrid later?",                       a: "Yes — Feston Vega hybrid inverters can be retrofitted. We design with future-readiness in mind." },
    { q: "Is government subsidy available for on-grid?",         a: "Yes — residential on-grid systems are eligible for PM Surya Ghar subsidy (up to ₹78,000). Commercial systems get accelerated depreciation tax benefits." },
  ],

  finalCta: {
    title: "Switch to net-metered solar today.",
    description: "Lowest-CAPEX path to solar — fastest payback, simplest ownership, no batteries needed.",
  },
};

/* ============================================================
   OFF-GRID — Standalone systems for energy independence
   ============================================================ */

export const OFF_GRID: SolutionConfig = {
  slug: "off-grid",
  category: { name: "Off-Grid Solar System", icon: Battery },
  accent:   { from: "from-purple-500", to: "to-fuchsia-600" },

  seo: {
    title: "Off-Grid Solar System · Standalone Solar with Battery | CSGPL",
    description:
      "Off-grid solar systems for total energy independence — Microtek MPPT inverters · lithium/lead-acid storage · rural electrification & remote sites · 25-yr warranty.",
  },

  hero: {
    badge: "Off-Grid Solar System",
    headline: { line1: "Total energy", serif: "with", gradient: "complete independence." },
    description:
      "Standalone solar systems that operate without grid connection — perfect for rural electrification, farmhouses, remote installations and applications demanding 24×7 self-supply.",
    highlights: [
      { icon: Battery,     label: "24×7 battery backup" },
      { icon: ShieldCheck, label: "Grid-independent" },
      { icon: Settings2,   label: "Custom sizing" },
      { icon: Sun,         label: "MPPT solar charger" },
    ],
    primaryCta:   { label: "Get Free Consultation", href: "/#consultation" },
    secondaryCta: { label: "Calculate Savings",     href: "/#roi" },
    image: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "24×7", label: "Self-sufficient operation", accent: "from-purple-500 to-fuchsia-600" },
  },

  benefits: [
    { icon: Battery,    title: "Energy Independence",   body: "Operate completely off the grid — perfect for sites without reliable utility power." },
    { icon: ShieldCheck,title: "Zero Outage Risk",       body: "No grid dependency means no outages — supply continues as long as battery & solar are healthy." },
    { icon: Settings2,  title: "Custom Sizing",          body: "Sized to your specific load profile and autonomy days — engineered, not off-the-shelf." },
    { icon: Award,      title: "Remote-Site Ready",      body: "Engineered for farmhouses, telecom towers, rural homes and any site without grid access." },
  ],

  howItWorks: {
    intro: "Off-grid systems are completely autonomous — solar charges batteries, batteries power loads, no utility needed.",
    steps: [
      { title: "Solar panels charge the battery", body: "MPPT charge controller (Microtek) optimises solar power into the battery bank — up to 80 A charge current." },
      { title: "Battery stores all daytime surplus", body: "Lithium-Ion or Lead-Acid bank sized for your daily load + autonomy reserve (1–3 days typical)." },
      { title: "Inverter powers your loads",       body: "Pure sine wave inverter (5 kVA / 48 V) supplies AC to home / business loads — sensitive electronics safe." },
      { title: "Cold-start operation",             body: "System can start from solar alone — no grid, no battery required at start-up." },
    ],
  },

  roi: {
    intro: "Off-grid economics depend on application — primary value is energy AVAILABILITY where grid is absent or unreliable.",
    cards: [
      { label: "DG fuel savings (Y1)",     value: "₹3–5 L",   hint: "vs. running a diesel generator daily",          accent: "brand" },
      { label: "Inverter capacity",         value: "5 kVA",    hint: "Microtek 48 V · scalable to 45 kVA",            accent: "blue" },
      { label: "Battery autonomy",          value: "1–3 days", hint: "Sized to your load + reserve",                  accent: "emerald" },
      { label: "Payback vs DG",             value: "2–4 yrs",  hint: "Where solar replaces diesel runtime",            accent: "amber" },
    ],
  },

  financing: [
    {
      icon: Battery, badge: "Battery Storage",
      title: "Lithium or Lead-Acid Options",
      body:
        "Lithium-Ion (LiFePO4) for premium longevity (10-yr life · 95% efficiency) or Lead-Acid for budget projects. We engineer the battery bank to your load profile and autonomy needs.",
      cta: { label: "Battery comparison", href: "/#consultation" },
    },
    {
      icon: IndianRupee, badge: "Rural Schemes",
      title: "Rural Electrification Support",
      body:
        "For qualifying rural / agricultural / community projects, government schemes (MNRE, state nodal agencies) provide capital subsidy. We help identify and apply for applicable programmes.",
      cta: { label: "Check eligibility", href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "Off-Grid Specialists",  body: "Two decades of off-grid system design experience — load profiling, autonomy sizing, BMS configuration." },
    { icon: Sun,         title: "Microtek MPPT Inverter",body: "5 kVA pure sine wave + MPPT charge controller · cold-start · parallel to 45 kVA · 10-yr engineered life." },
    { icon: Settings2,   title: "Battery Engineering",   body: "Lithium-Ion or Lead-Acid · sized to your load + autonomy days · integrated BMS · 10-yr LFP warranty." },
    { icon: Award,       title: "Remote Site Execution", body: "We deploy to remote sites others won't touch — full logistics, civil works, commissioning included." },
    { icon: BarChart3,   title: "Load Profiling",        body: "Detailed energy audit before sizing — appliance-by-appliance load profile drives system & battery sizing." },
    { icon: Zap,         title: "DG Hybrid Ready",       body: "System integrates with existing diesel generators for backup-of-backup — DG runs only as last resort." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Farmhouse Off-Grid System", location: "Rural UP",
      size: "10 kW + 30 kWh", output: "100% self-sufficient · zero grid", type: "Off-Grid",
      image: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Rural Home",          location: "Bundelkhand",  size: "3 kW + 10 kWh",  output: "24×7 essential loads",   type: "Off-Grid",
        image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Telecom Tower",       location: "Remote UP",    size: "5 kW + 20 kWh",  output: "Replaces DG runtime",    type: "Off-Grid",
        image: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Holiday Farm Stay",   location: "Outskirts UP", size: "8 kW + 25 kWh",  output: "Fully off-grid resort",  type: "Off-Grid",
        image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Get your off-grid solar quote",
    subtitle: "Site visit · load audit · battery autonomy sizing · transparent BOQ — delivered in 5 working days.",
    bullets: [
      "Free site visit (anywhere in India)",
      "Detailed appliance-level load audit",
      "Battery autonomy sizing (1–3 days)",
      "DG-hybrid integration if needed",
    ],
  },

  faqs: [
    { q: "Do I need batteries for off-grid?",                    a: "Yes — off-grid means no grid backup. Batteries store daytime solar to power loads at night and during low-sun periods. Battery sizing depends on your load and autonomy needs." },
    { q: "How many days of autonomy should I design for?",       a: "Typically 1–3 days. 1 day for mild climates with consistent sunlight, 2–3 days for monsoon regions or critical loads. We size based on your site & risk tolerance." },
    { q: "Lithium-Ion vs Lead-Acid — which one?",                a: "Lithium-Ion (LFP) lasts 10+ years, has 95% efficiency and needs no maintenance — best long-term value. Lead-Acid is 30–40% cheaper upfront but needs replacement every 3–5 years." },
    { q: "Can I add a diesel generator as backup?",              a: "Yes — Microtek inverters support DG integration. The DG runs only when battery is depleted AND solar is unavailable (rare). This is the most reliable configuration for critical loads." },
    { q: "What's the typical payback vs running a DG?",          a: "If you're currently running a diesel generator daily, off-grid solar typically pays back in 2–4 years through fuel savings alone — and the system continues for 25+ years after." },
    { q: "Can I expand the system later?",                       a: "Yes — Microtek inverters support parallel operation up to 45 kVA. Battery banks can be expanded modularly. We design with future expansion in mind." },
  ],

  finalCta: {
    title: "Get true energy independence.",
    description: "Engineered off-grid solar systems for sites where reliable grid power isn't an option.",
  },
};

/* ============================================================
   HYBRID — Grid-tied + battery backup
   ============================================================ */

export const HYBRID: SolutionConfig = {
  slug: "hybrid",
  category: { name: "Hybrid Solar System", icon: Sun },
  accent:   { from: "from-amber-500", to: "to-rose-500" },

  seo: {
    title: "Hybrid Solar System · Grid-Tied + Battery Backup EPC | CSGPL",
    description:
      "Hybrid solar — best of both worlds. Net-metered grid-tied with battery backup, 10ms switchover, TOU scheduling, Feston Vega inverters. Residential & commercial.",
  },

  hero: {
    badge: "Hybrid Solar System",
    headline: { line1: "Best of both worlds", serif: "with", gradient: "hybrid solar." },
    description:
      "Grid-tied solar with intelligent battery storage — sell surplus to the grid, store reserves for power cuts, optimise for Time-of-Use tariffs. The most complete solar architecture.",
    highlights: [
      { icon: Sun,         label: "Grid + battery hybrid" },
      { icon: Zap,         label: "10ms switchover" },
      { icon: TrendingUp,  label: "TOU scheduling" },
      { icon: ShieldCheck, label: "150% overload capacity" },
    ],
    primaryCta:   { label: "Get Free Consultation", href: "/#consultation" },
    secondaryCta: { label: "Calculate Savings",     href: "/#roi" },
    image: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
    floatingKpi: { value: "10ms", label: "Grid-to-battery switchover", accent: "from-amber-500 to-rose-500" },
  },

  benefits: [
    { icon: Battery,    title: "Power Cut Immunity",     body: "10ms switchover keeps critical loads running through outages — no UPS required." },
    { icon: TrendingUp, title: "TOU Tariff Optimisation",body: "Charge battery from solar/grid during off-peak; discharge during peak tariff — measurable bill optimisation." },
    { icon: IndianRupee,title: "Net Metering Credits",    body: "Export surplus to the grid via net metering AND keep battery reserves for backup — both benefits." },
    { icon: Award,      title: "Future-Proof System",    body: "Add more batteries later · supports old + new battery packs · 25-yr architecture." },
  ],

  howItWorks: {
    intro: "Hybrid systems intelligently route energy in real-time — solar to load, surplus to battery, surplus to grid, grid to load when needed.",
    steps: [
      { title: "Solar charges loads + battery", body: "During daylight, solar powers your loads first, then charges the battery, then exports surplus." },
      { title: "Battery handles outages instantly", body: "When grid fails, Feston Vega switches to battery in 10ms — sensitive electronics never notice." },
      { title: "TOU scheduling optimises tariffs", body: "Schedule battery charge/discharge against your tariff structure to minimise net cost." },
      { title: "Grid as ultimate backup",        body: "If battery is low AND solar unavailable, grid kicks in — true 24×7 supply." },
    ],
  },

  roi: {
    intro: "Hybrid economics blend net-metering revenue with backup value and TOU optimisation — higher CAPEX, broader benefit.",
    cards: [
      { label: "Monthly savings (5 kW)",   value: "₹6,500+",  hint: "Solar + TOU optimisation",                  accent: "brand" },
      { label: "Backup value",             value: "Priceless",hint: "Zero downtime for critical loads",          accent: "amber" },
      { label: "Typical payback",          value: "4–6 yrs",  hint: "Higher CAPEX, broader benefit",             accent: "emerald" },
      { label: "Switchover time",          value: "10 ms",    hint: "Faster than a UPS · sensitive load safe",    accent: "blue" },
    ],
  },

  financing: [
    {
      icon: Battery, badge: "Battery Compatibility",
      title: "Feston Vega LV + HV Battery System",
      body:
        "Vega 1P single-phase inverters pair with LV 51.2V batteries (residential). Vega 3P three-phase inverters pair with HV 150–200V batteries (commercial). Both support parallel scaling.",
      cta: { label: "Battery sizing guide", href: "/#consultation" },
    },
    {
      icon: TrendingUp, badge: "TOU Optimisation",
      title: "Time-of-Use Configuration",
      body:
        "We configure Vega's TOU scheduling to match your tariff structure — charging during cheap hours, discharging during peak. Measurable additional savings on TOU tariffs.",
      cta: { label: "Discuss TOU strategy", href: "/#consultation" },
    },
  ],

  whyChooseUs: [
    { icon: ShieldCheck, title: "Hybrid Specialists",     body: "Designed and deployed 1000+ hybrid systems · single accountable project manager · transparent BOQ." },
    { icon: Sun,         title: "Feston Vega Ecosystem",  body: "Vega 1P (3–6 kW) for residential, Vega 3P (10–20 kW) for commercial. Both with native battery & TOU support." },
    { icon: Settings2,   title: "End-to-End EPC",         body: "Survey · design · supply · install · DISCOM filing · battery commissioning · AMC — one contract." },
    { icon: Award,       title: "10ms Switchover",        body: "Critical loads experience zero interruption during grid failures — sensitive electronics & medical equipment safe." },
    { icon: BarChart3,   title: "Live Monitoring",        body: "Track solar generation, battery SOC, grid import/export and load consumption — all in one app." },
    { icon: Zap,         title: "150% Overload Capacity", body: "Handles motor/compressor startup surges without tripping — commercial-grade resilience for residential & commercial use." },
  ],

  productEcosystem: PRODUCT_ECOSYSTEM,

  projects: {
    featured: {
      title: "Premium Villa Hybrid", location: "Lucknow, UP",
      size: "10 kW + 15 kWh", output: "Zero downtime · ₹8K/mo savings", type: "Hybrid",
      image: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    },
    others: [
      { title: "Clinic Critical Loads", location: "Varanasi, UP", size: "5 kW + 10 kWh",  output: "24×7 medical eq.",  type: "Hybrid",
        image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Small Office Hybrid",  location: "Kanpur, UP",   size: "12 kW + 20 kWh", output: "TOU optimised",      type: "Hybrid",
        image: "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
      { title: "Boutique Hotel",       location: "Noida, UP",    size: "15 kW + 25 kWh", output: "Zero downtime",      type: "Hybrid",
        image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900" },
    ],
  },

  consultation: {
    title: "Get your hybrid solar quote",
    subtitle: "Free site survey · load + outage analysis · battery sizing · TOU strategy — full proposal within 48 hours.",
    bullets: [
      "Free site survey & outage frequency analysis",
      "LV / HV battery sizing recommendation",
      "TOU tariff optimisation strategy",
      "Net metering + battery backup — both included",
    ],
  },

  faqs: [
    { q: "Is hybrid worth the extra CAPEX over on-grid?",         a: "If you have frequent power cuts, run sensitive equipment, or have a TOU tariff structure — yes, the backup value + TOU savings justify the additional cost. If grid is reliable & flat-tariff, on-grid is more economical." },
    { q: "How long does the battery backup last?",                a: "Depends on battery size & load. A typical 10 kWh battery powers essential loads (lights, fans, fridge, router, TV) for 8–12 hours of outage. We size to your specific needs." },
    { q: "What's TOU and how does it save money?",                a: "Time-of-Use tariffs charge higher during peak hours (typically evening). Hybrid systems charge battery from cheap solar/off-peak grid, then discharge during expensive peak — directly reducing your bill." },
    { q: "Can I add batteries later?",                            a: "Yes — Feston Vega supports parallel battery expansion. You can start with a smaller battery and add more capacity as needs grow." },
    { q: "Does the inverter switch to backup instantly?",         a: "Yes — 10ms switchover. Faster than typical UPS systems. Sensitive electronics (computers, medical equipment, networking gear) don't experience any interruption." },
    { q: "Will I still get net metering credits?",                a: "Yes — hybrid systems support both. Surplus solar that doesn't fit in the battery is exported to the grid as net-metering credits." },
  ],

  finalCta: {
    title: "Get the most complete solar system.",
    description: "Hybrid solar — grid revenue + battery backup + TOU optimisation. The complete energy architecture.",
  },
};

/* ============================================================
   REGISTRY
   ============================================================ */

export const SOLUTIONS: Record<SolutionSlug, SolutionConfig> = {
  residential: RESIDENTIAL,
  commercial:  COMMERCIAL,
  industrial:  INDUSTRIAL,
  "on-grid":   ON_GRID,
  "off-grid":  OFF_GRID,
  hybrid:      HYBRID,
};

export const getSolutionBySlug = (slug: string) =>
  (SOLUTIONS as Record<string, SolutionConfig | undefined>)[slug];
