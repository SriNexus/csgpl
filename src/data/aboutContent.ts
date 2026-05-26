/**
 * About page content — rewritten professionally.
 * Single source of truth for the entire /about route.
 */

import {
  Award, Cpu, Handshake, HeartHandshake, ShieldCheck, Sparkles, type LucideIcon,
} from "lucide-react";

/* ============================================================
   HERO
   ============================================================ */

export const aboutHero = {
  badge: "About CSGPL",
  headline: {
    line1: "Powering a cleaner future",
    serif:  "with",
    gradient: "smart solar energy.",
  },
  description:
    "ChaitanyaSri Greentech is a full-service Solar EPC company building reliable, high-yield renewable energy systems for India's homes, businesses and industries — engineered for the long term.",
  primaryCta:   { label: "Get Free Consultation", href: "/#consultation" },
  secondaryCta: { label: "Explore Solutions",     href: "/products" },
  image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1400",
} as const;

/* ============================================================
   COMPANY STORY (timeline)
   ============================================================ */

export interface StoryMilestone {
  year: string;
  title: string;
  body: string;
}

export const companyStory = {
  eyebrow: "Our Journey",
  title: "Engineering India's renewable future,",
  titleAccent: "one project at a time.",
  intro:
    "Our story began with a simple belief: clean energy should be reliable, affordable and accessible to every Indian home and business. Two decades later, that belief still drives every system we design and install.",
  milestones: [
    {
      year: "2003",
      title: "Roots in Santosh Energy Techno Solutions",
      body: "The founding team launched Santosh Energy Techno Solutions, focused on energy infrastructure consulting and power-electronics distribution across Uttar Pradesh.",
    },
    {
      year: "2014",
      title: "Solar EPC focus",
      body: "Anticipating India's renewable transition, the team pivoted toward solar EPC — designing and commissioning rooftop systems for residential and commercial customers.",
    },
    {
      year: "2018",
      title: "ChaitanyaSri Greentech is incorporated",
      body: "ChaitanyaSri Greentech Pvt. Ltd. is incorporated as a dedicated renewable energy company with a unified mission: accelerate India's clean energy adoption.",
    },
    {
      year: "2021",
      title: "Statewide expansion",
      body: "Operations expand across UP and the wider North India market. Industrial and institutional EPC projects join the residential and commercial portfolio.",
    },
    {
      year: "Today",
      title: "A modern solar EPC platform",
      body: "Headquartered in Lucknow with a project office in Varanasi, CSGPL delivers end-to-end EPC — survey, design, supply, installation, monitoring and AMC — for every project scale.",
    },
  ] as StoryMilestone[],
};

/* ============================================================
   WHY CHOOSE US — 6 cards
   ============================================================ */

export interface ValuePillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const whyChooseUs: ValuePillar[] = [
  {
    icon: Cpu,
    title: "Premium Solar Technology",
    body: "N-Type TOPCon bifacial panels, high-efficiency inverters and lithium storage — selected for real Indian conditions.",
  },
  {
    icon: ShieldCheck,
    title: "Tier-1 Component Stack",
    body: "Emmvee, Feston and other BIS-certified, ALMM-approved manufacturers backed by manufacturer warranties.",
  },
  {
    icon: Award,
    title: "Experienced EPC Team",
    body: "Two decades of energy engineering experience — from feasibility studies to commissioning and long-term operations.",
  },
  {
    icon: Sparkles,
    title: "End-to-End Execution",
    body: "Single accountable team for site survey, design, supply, installation, net-metering and AMC. One contract, zero finger-pointing.",
  },
  {
    icon: Handshake,
    title: "Transparent Consultation",
    body: "Detailed BOQ, honest payback estimates, subsidy assistance and clear timelines. No upsell, no hidden cost.",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Support",
    body: "25 years of generation deserves 25 years of partnership. AMC plans, remote monitoring and rapid on-site response.",
  },
];

/* ============================================================
   MISSION & VISION
   ============================================================ */

export const missionVision = {
  mission: {
    label: "Our Mission",
    title: "Accelerate India's clean energy transition.",
    body:
      "Make modern solar technology accessible to every home, business and industry — engineered to deliver reliable savings, reduce carbon footprint, and unlock long-term energy independence.",
    points: [
      "Reliable solar systems backed by tier-1 components",
      "Transparent financial models — honest payback estimates",
      "End-to-end execution with one accountable team",
      "25-year support partnership, not a one-off install",
    ],
  },
  vision: {
    label: "Our Vision",
    title: "A sustainable India powered by clean energy.",
    body:
      "A future where every rooftop generates clean power, energy bills become an asset rather than a liability, and India leads the global renewable transition with engineering excellence.",
    points: [
      "Net-zero solar at every relevant scale",
      "Mainstream adoption beyond early adopters",
      "Modern technology, indigenous engineering",
      "Energy independence as the new normal",
    ],
  },
};

/* ============================================================
   PROCESS — 5 steps
   ============================================================ */

export interface ProcessStepData {
  title: string;
  body: string;
}

export const workProcess: ProcessStepData[] = [
  { title: "Consultation",            body: "Understand your energy needs, budget and site through a free expert call." },
  { title: "Site Assessment",         body: "On-site survey for shadow analysis, roof load and electrical capacity." },
  { title: "Custom Solar Design",     body: "Engineering-grade system design with detailed BOQ and DISCOM approval." },
  { title: "Installation & Commissioning", body: "Certified installers deploy in 3–7 days; commissioning includes net-metering." },
  { title: "Monitoring & Support",    body: "Smart app monitoring, AMC plans and 25-yr performance support." },
];

/* ============================================================
   LEADERSHIP
   ============================================================ */

export interface Leader {
  id: string;
  name: string;
  role: string;
  initials: string;
  /** 2-sentence executive bio. */
  bio: string;
  /** Single-line leadership philosophy. */
  philosophy: string;
  /** 3 short highlights — "20+ yrs", "Solar EPC", etc. */
  highlights: string[];
}

export const leadership: Leader[] = [
  {
    id: "ashish",
    name: "Ashish Kaushik",
    role: "Managing Director",
    initials: "AK",
    bio:
      "Ashish leads ChaitanyaSri Greentech's strategy, customer experience and commercial growth. Over two decades in energy distribution and EPC have shaped his commitment to engineering quality and long-term customer partnerships.",
    philosophy:
      "\"Solar is a 25-year promise. Every component, every cable, every conversation has to honour that.\"",
    highlights: ["20+ yrs in energy", "EPC & operations", "Strategy & growth"],
  },
  {
    id: "naresh",
    name: "Naresh Kumar Sharma",
    role: "Director — Engineering",
    initials: "NS",
    bio:
      "Naresh oversees engineering design, technical procurement and project execution. His background in electrical power systems anchors the team's discipline on system reliability, safety and code compliance.",
    philosophy:
      "\"The best design is the one that performs invisibly — for decades.\"",
    highlights: ["Electrical engineering", "Project execution", "Quality & safety"],
  },
  {
    id: "aditi",
    name: "Aditi Kaushik",
    role: "Director — Brand & Operations",
    initials: "AK",
    bio:
      "Aditi leads brand, marketing and operational excellence at ChaitanyaSri Greentech. She drives the company's customer-first culture and is responsible for the consultative sales experience CSGPL is known for.",
    philosophy:
      "\"A solar quote is also a relationship. We earn it with clarity, not pressure.\"",
    highlights: ["Brand & marketing", "Operations", "Customer experience"],
  },
];

/* ============================================================
   ACHIEVEMENTS — animated counters
   ============================================================ */

export interface AchievementStat {
  /** Numeric target — used by useCounter. */
  target: number;
  /** Suffix appended to the animated number (e.g. "+", " MW+"). */
  suffix: string;
  /** Optional prefix (e.g. "₹"). */
  prefix?: string;
  label: string;
  hint?: string;
}

export const achievements: AchievementStat[] = [
  { target: 6,      suffix: "+",  label: "Years Delivering Solar",   hint: "Since incorporation" },
  { target: 15000,  suffix: "+",  label: "Systems Installed",        hint: "Across UP & beyond" },
  { target: 3.5,    suffix: " MW+",label: "Capacity Commissioned",   hint: "And growing every quarter" },
  { target: 2999,   suffix: "+",  label: "Happy Customers",          hint: "4.9 ★ avg rating" },
];

/* ============================================================
   TRUST PARTNERS (component brand portfolio)
   ============================================================ */

export const trustPartners = {
  eyebrow: "Powered by tier-1 brands",
  title: "Built on a premium component stack.",
  body:
    "Every CSGPL installation uses a curated set of BIS-certified, ALMM-listed manufacturers — chosen for proven field performance, transparent warranties and modern engineering.",
  brands: ["Emmvee", "Feston", "Microtek", "TATA Steel", "Apollo Steel", "Havells", "Elmex", "Polycab"],
};

/* ============================================================
   FINAL CTA
   ============================================================ */

export const aboutFinalCta = {
  badge: "Ready to start",
  title: "Let's build a sustainable future, together.",
  body:
    "Free site survey, transparent quote and a 25-year partnership — get started in less than 60 seconds.",
  primaryCta:   { label: "Get Free Quote",       href: "/#consultation" },
  secondaryCta: { label: "Talk to Solar Expert", href: "tel:+919305806938" },
};
