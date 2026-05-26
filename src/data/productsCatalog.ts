/**
 * Premium product catalog — single source of truth for every product
 * surface across the site (homepage preview, Products landing, category
 * pages, product detail pages, nav menu, footer links).
 *
 * Sourced from the CSGPL Solar Products document — Sections C, D, E, F, G.
 */

import {
  Sun, Cpu, Battery, Wrench, Cable, Plug, Shield, Award, Leaf, Layers,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   CATEGORIES
   ============================================================ */

export interface ProductCategory {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: { from: string; to: string };
  stats: { label: string; value: string }[];
}

export const productCategories: ProductCategory[] = [
  {
    slug: "solar-panels",
    name: "Solar Panels",
    shortName: "Panels",
    tagline: "N-Type TOPCon bifacial modules",
    description:
      "N-Type TOPCon bifacial modules from leading Indian manufacturers — Emmvee, Jakson Solar & RenewSys. ALMM-approved, BIS-certified, glass-to-glass durability with 30-year performance warranties.",
    icon: Sun,
    accent: { from: "from-amber-400", to: "to-orange-500" },
    stats: [
      { label: "Max efficiency", value: "23.26%" },
      { label: "Power range",    value: "530–625 Wp" },
      { label: "Performance",    value: "30 yrs" },
    ],
  },
  {
    slug: "inverters",
    name: "Solar Inverters",
    shortName: "Inverters",
    tagline: "On-Grid, Hybrid & Off-Grid inverters",
    description:
      "Feston EnGield on-grid string inverters, Feston Vega hybrid inverters with battery storage and Microtek off-grid MPPT inverters — a unified inverter ecosystem from 1.5 kW residential to 25 kW industrial.",
    icon: Cpu,
    accent: { from: "from-blue-500", to: "to-indigo-600" },
    stats: [
      { label: "Peak efficiency", value: "98.6%" },
      { label: "Capacity range",  value: "1.5–25 kW" },
      { label: "Warranty",        value: "10 yrs" },
    ],
  },
  {
    slug: "batteries",
    name: "Solar Batteries",
    shortName: "Batteries",
    tagline: "LV & HV Lithium-Ion storage",
    description:
      "LV (51.2 V) and HV (150–200 V) lithium-ion batteries engineered for Feston Vega hybrid inverters — scalable parallel expansion, integrated BMS, CAN/RS485 communication for residential & commercial energy storage.",
    icon: Battery,
    accent: { from: "from-emerald-500", to: "to-teal-600" },
    stats: [
      { label: "LV voltage",  value: "51.2 V" },
      { label: "HV range",    value: "150–200 V" },
      { label: "Expansion",   value: "Up to 15" },
    ],
  },
  {
    slug: "solar-bos",
    name: "Solar BOS",
    shortName: "BOS",
    tagline: "Structures, ACDB/DCDB, cables, earthing",
    description:
      "Pre-galvanised & hot-dip GI mounting structures (TATA & Apollo Steel), custom-fabricated ACDB/DCDB protection boxes (Havells/Elmex), Microtek solar DC cables and IS 3043-compliant earthing systems.",
    icon: Wrench,
    accent: { from: "from-purple-500", to: "to-fuchsia-600" },
    stats: [
      { label: "Wind design",  value: "180 km/h" },
      { label: "Standards",    value: "IS 800" },
      { label: "DC rating",    value: "1500 V" },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    shortName: "Accessories",
    tagline: "Connectors, junction boxes, labels & more",
    description:
      "MC4 PV connectors, junction boxes, cable trays, roof hooks, compression lugs, sealants and CEA-compliant solar hazard labels — every component grade-matched to the installation environment.",
    icon: Cable,
    accent: { from: "from-rose-500", to: "to-pink-600" },
    stats: [
      { label: "Connectors", value: "IP67/IP68" },
      { label: "DC voltage", value: "1500 V" },
      { label: "Standards",  value: "IEC 62852" },
    ],
  },
];

export const getCategoryBySlug = (slug: string) =>
  productCategories.find((c) => c.slug === slug);

/* ============================================================
   PRODUCT RECORD
   ============================================================ */

export interface ProductSpec { label: string; value: string }
export interface ProductSpecGroup { title: string; rows: ProductSpec[] }
export interface ProductFAQ { q: string; a: string }
export interface ProductDownload { label: string; type: string }

export interface FeaturedProduct {
  /** Stable identifier */
  id: string;
  /** URL slug — /products/:categorySlug/:slug */
  slug: string;
  categorySlug: string;

  /** Brand name displayed on cards */
  brand: string;
  /** Optional brand slug for filtering (e.g. "emmvee") */
  brandSlug?: string;

  /** Main product title (e.g. "Helia NXTR") */
  title: string;
  /** Power / model qualifier (e.g. "610–625 Wp") */
  subtitle: string;
  /** One-line h2 / technology line */
  technology: string;

  /** 1–2 sentence overview */
  shortDescription: string;
  /** Long-form copy for detail pages */
  longDescription: string;

  /** Primary product image */
  image: string;

  /** 8–12 bullet highlights */
  highlights: string[];

  /** Marketing copy for "Why choose" section on detail page */
  whyChoose: string;

  /** Quick (≤6) summary specs for hero strip + cards */
  specs: ProductSpec[];
  /** Grouped detailed spec tables (Electrical, Mechanical, Thermal, etc.) */
  specGroups?: ProductSpecGroup[];

  /** Applications list */
  applications: string[];

  /** Certifications & compliance */
  certifications?: string[];
  /** Warranty summary */
  warranty?: ProductSpec[];

  /** Available downloads */
  downloads?: ProductDownload[];

  /** Quick FAQ */
  faqs?: ProductFAQ[];

  /** Filter tags — used by category page filter chips */
  tags?: string[];

  /** SEO meta */
  seo: { title: string; description: string };
}

/* ============================================================
   PRODUCT ENTRIES — SECTION C, D, E, F, G
   ============================================================ */

export const featuredProducts: FeaturedProduct[] = [
  /* ============ C.1 — JAKSON SOLAR HELIA NXTR ============ */
  {
    id: "jakson-helia-nxtr",
    slug: "jakson-solar-helia-nxtr-610-625wp",
    categorySlug: "solar-panels",
    brand: "Jakson Solar",
    brandSlug: "jakson",
    title: "Helia NXTR G12R",
    subtitle: "610–625 Wp",
    technology: "N-Type TOPCon Bifacial Dual Glass · ALMM Approved",
    shortDescription:
      "Flagship 610–625 Wp N-Type TOPCon bifacial dual-glass module on G12R rectangular half-cut architecture. ALMM approved, BIS certified, 23.16% efficiency, 30-year linear warranty.",
    longDescription:
      "Jakson Solar's Helia NXTR series represents a significant step forward from the previous generation of mono-PERC modules. The shift to N-Type TOPCon cells on the G12R (large rectangular wafer) format enables higher power density per module, fewer mounting points per megawatt, and lower balance-of-system cost for large-scale installations. The bifacial dual-glass construction captures direct and diffuse front-side irradiance plus additional reflected light from the rear — delivering up to 30% bifacial gain under favourable ground-reflectance conditions.",
    image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "N-Type TOPCon G12R Rectangular Half-Cut cells — 132 cells",
      "Power output: 610 Wp to 625 Wp",
      "Maximum module efficiency: 23.16%",
      "Dual glass: 2.0 mm AR-coated front + 2.0 mm heat-strengthened rear",
      "Bifacial gain up to 30%",
      "Multi-Busbar (MBB) technology for reduced resistive loss",
      "Enhanced anti-LID performance — lower annual degradation",
      "Snow load 5400 Pa · Wind load 2400 Pa · IP68 junction box",
      "ALMM Approved · BIS Certified (IS 14286)",
      "IEC 61215 / IEC 61730 / IEC 62804 / IEC 61701 / IEC 62716",
      "12-yr product + 30-yr linear warranty (87.4% @ Year 30)",
      "Made in India · Non-DCR available",
    ],
    whyChoose:
      "Anodised aluminium alloy frame withstands 5400 Pa snow load and 2400 Pa wind load, with the IP68 junction box providing complete waterproof integrity. ISO 9001:2015, 14001:2015 and 45001:2018 manufacturing certifications confirm consistent production quality. For a solar EPC operating projects with 25–30 year financial models, the TOPCon advantage over PERC compounds to substantially higher lifetime energy yield.",
    specs: [
      { label: "Power",         value: "610–625 Wp" },
      { label: "Efficiency",    value: "23.16%" },
      { label: "Technology",    value: "N-Type TOPCon G12R" },
      { label: "Bifaciality",   value: "80 ± 5%" },
      { label: "Warranty",      value: "12 + 30 yrs" },
      { label: "Compliance",    value: "ALMM · BIS" },
    ],
    specGroups: [
      {
        title: "Electrical (STC: 1000 W/m², 25 °C, AM 1.5)",
        rows: [
          { label: "JN-610GR · Pmax",   value: "610 Wp · Vmp 40.94 V · Imp 14.90 A · Voc 49.26 V · Isc 15.77 A" },
          { label: "JN-615GR · Pmax",   value: "615 Wp · Vmp 41.09 V · Imp 14.97 A · Voc 49.47 V · Isc 15.83 A" },
          { label: "JN-620GR · Pmax",   value: "620 Wp · Vmp 41.23 V · Imp 15.04 A · Voc 49.67 V · Isc 15.89 A" },
          { label: "JN-625GR · Pmax",   value: "625 Wp · Vmp 41.37 V · Imp 15.11 A · Voc 49.87 V · Isc 15.95 A" },
          { label: "Module Efficiency", value: "22.60% – 23.16%" },
          { label: "Power Tolerance",   value: "0 / +4.99 W" },
        ],
      },
      {
        title: "Mechanical & Physical",
        rows: [
          { label: "Cell Type",           value: "N-Type TOPCon — G12R Rectangular Half-Cut" },
          { label: "Number of Cells",     value: "132" },
          { label: "Dimensions (L×W×H)",  value: "2382 × 1133 × 30 mm" },
          { label: "Module Weight",       value: "33.5 kg ± 3%" },
          { label: "Front Glass",         value: "2.0 mm High-Transmission AR-Coated Tempered" },
          { label: "Back Glass",          value: "2.0 mm Heat-Strengthened (Dual Glass)" },
          { label: "Frame",               value: "Anodised Aluminium Alloy" },
          { label: "Junction Box",        value: "IP68 — Split type, 3 bypass diodes" },
          { label: "Cable",               value: "400 mm, 4.0 mm² solar cable, MC4 compatible" },
          { label: "Encapsulation",       value: "PID & UV Resistant Coextruded POE" },
          { label: "Max. Snow Load",      value: "5400 Pa" },
          { label: "Max. Wind Load",      value: "2400 Pa" },
          { label: "Max. System Voltage", value: "1500 V DC" },
          { label: "Max. Series Fuse",    value: "35 A" },
        ],
      },
      {
        title: "Thermal Data",
        rows: [
          { label: "Temp. Coefficient of Pmax", value: "-0.30% / °C" },
          { label: "Temp. Coefficient of Voc",  value: "-0.25% / °C" },
          { label: "Temp. Coefficient of Isc",  value: "+0.046% / °C" },
          { label: "Operating Temperature",     value: "-40 °C to +85 °C" },
        ],
      },
      {
        title: "Bifacial Energy Gain (JN-625GR)",
        rows: [
          { label: "10% Ground Reflectance", value: "688 W · 25.49% efficiency" },
          { label: "15% Ground Reflectance", value: "719 W · 26.64% efficiency" },
          { label: "20% Ground Reflectance", value: "750 W · 27.79% efficiency" },
          { label: "25% Ground Reflectance", value: "781 W · 28.94% efficiency" },
        ],
      },
    ],
    applications: [
      "Utility-scale ground-mounted solar power plants",
      "Large commercial and industrial (C&I) rooftop solar",
      "Government projects requiring DCR / ALMM compliance",
      "Agrivoltaic installations with ground-level crop cultivation",
      "Canal-top and carport solar projects",
      "Institutional installations — schools, hospitals, government buildings",
    ],
    certifications: [
      "IEC 61215 · IEC 61730 (I & II)",
      "IEC 61853 · IEC 60068 · IEC 62804 (Anti-PID)",
      "IEC 61701 (Salt Mist) · IEC 62716 (Ammonia)",
      "IS 14286 · BIS Registration No. R-03005859",
      "ISO 9001:2015 · 14001:2015 · 45001:2018",
      "ALMM Listed · Made in India",
    ],
    warranty: [
      { label: "Product Warranty",            value: "12 Years" },
      { label: "Linear Performance Warranty", value: "30 Years" },
      { label: "Year 1 Degradation Limit",    value: "≤ 1.0%" },
      { label: "Output at Year 30",           value: "87.4% of rated" },
    ],
    downloads: [
      { label: "Helia NXTR Datasheet (PDF)",       type: "datasheet" },
      { label: "Warranty Terms Document (PDF)",    type: "warranty" },
      { label: "ALMM Approval Certificate (PDF)",  type: "certificate" },
    ],
    faqs: [
      { q: "Is this module ALMM-approved for government projects?", a: "Yes — Helia NXTR is ALMM listed. The Non-DCR variant suits commercial projects; DCR can be discussed with the manufacturer for government tender submissions." },
      { q: "What's the bifacial gain in real-world installations?", a: "Bifacial gain varies with installation height, tilt and ground albedo. Typical Indian rooftop and ground-mount projects see 10–25% additional yield. Elevated/canal-top installations on white concrete can reach 30%." },
      { q: "Does the 30-year performance warranty cover all power output?", a: "Yes — the linear performance warranty guarantees ≥87.4% of rated power at Year 30, with Year 1 degradation capped at 1.0%." },
    ],
    tags: ["TOPCon", "Bifacial", "ALMM", "Non-DCR", "Utility", "G12R", "Dual-Glass"],
    seo: {
      title: "Jakson Solar Helia NXTR 610–625 Wp TOPCon Module · ALMM Approved | CSGPL",
      description:
        "Buy Jakson Solar Helia NXTR G12R 610–625 Wp N-Type TOPCon bifacial dual-glass solar module. 23.16% efficiency, ALMM approved, BIS certified, 30-year warranty. Non-DCR available.",
    },
  },

  /* ============ C.2 — EMMVEE TITANIUM DUO ============ */
  {
    id: "emmvee-titanium-duo",
    slug: "emmvee-titanium-duo-530-625wp",
    categorySlug: "solar-panels",
    brand: "Emmvee",
    brandSlug: "emmvee",
    title: "Titanium Duo",
    subtitle: "530–625 Wp",
    technology: "N-Type TOPCon Bifacial Glass-to-Glass · DCR & Non-DCR",
    shortDescription:
      "530–625 Wp N-Type TOPCon bifacial glass-to-glass modules with 144 half-cut cells, up to 22.4% efficiency, backed by 30+ years of Emmvee's solar manufacturing heritage.",
    longDescription:
      "Emmvee, established in 1992, brings three decades of manufacturing refinement to the Titanium Duo. The glass-to-glass (G2G) construction distinguishes this module from conventional single-glass designs — replacing the polymer backsheet with a second pane of tempered glass. This dual-glass sandwich significantly extends the module's operational life by eliminating backsheet UV degradation, moisture ingress and delamination — failure modes that account for a substantial share of module field failures in India's harsh climate.",
    image: "https://images.pexels.com/photos/17965455/pexels-photo-17965455.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "N-Type TOPCon bifacial glass-to-glass (G2G) construction",
      "Power range: 530–625 Wp · Module efficiency up to 22.4%",
      "144 Half-Cut TOPCon mono-crystalline cells",
      "Bifaciality factor: 80 ± 5%",
      "Multi-Busbar (MBB) technology — reduced resistive loss",
      "AR-coated high-transmission front glass",
      "PID (Potential Induced Degradation) resistant",
      "Snow load 5400 Pa · Hail resistance 25 mm @ 23 m/s",
      "MC4-compatible connectors · EVA/POE/EPE encapsulant",
      "Anodised aluminium alloy frame — corrosion resistant",
      "Positive power tolerance: 0 to +5 W",
      "DCR & Non-DCR variants · CE · DNV · TUV Rheinland",
    ],
    whyChoose:
      "The dual-glass sandwich significantly extends operational life by eliminating backsheet UV degradation, moisture ingress and delamination. Multi-Busbar interconnection reduces resistive losses while bifaciality of 80 ± 5% enables meaningful rear-side energy harvesting. PID-resistant design ensures stable performance under high-voltage string configurations.",
    specs: [
      { label: "Power",       value: "530–625 Wp" },
      { label: "Efficiency",  value: "Up to 22.4%" },
      { label: "Technology",  value: "TOPCon G2G" },
      { label: "Cells",       value: "144 Half-Cut" },
      { label: "Warranty",    value: "12 + 30 yrs" },
      { label: "Origin",      value: "India · Bengaluru" },
    ],
    specGroups: [
      {
        title: "Electrical Series 1 (540–550 Wp)",
        rows: [
          { label: "ES-540MHC144Bi-16T", value: "540 W · η 20.90% · Voc 49.87 V · Isc 13.89 A · Vmp 41.21 V · Imp 13.11 A" },
          { label: "ES-545MHC144Bi-16T", value: "545 W · η 21.10% · Voc 50.07 V · Isc 13.93 A · Vmp 41.41 V · Imp 13.16 A" },
          { label: "ES-550MHC144Bi-16T", value: "550 W · η 21.29% · Voc 50.27 V · Isc 14.01 A · Vmp 41.58 V · Imp 13.23 A" },
        ],
      },
      {
        title: "Electrical Series 2 (565–585 Wp)",
        rows: [
          { label: "EMMBGH61441 (565W)", value: "η 21.8% · Voc 51.47 V · Isc 14.43 A · Vmp 42.71 V · Imp 13.38 A" },
          { label: "EMMBGH61442 (570W)", value: "η 22.0% · Voc 51.87 V · Isc 14.49 A · Vmp 42.81 V · Imp 13.39 A" },
          { label: "EMMBGH61443 (575W)", value: "η 22.2% · Voc 52.17 V · Isc 14.52 A · Vmp 43.23 V · Imp 13.30 A" },
          { label: "EMMBGH61444 (580W)", value: "η 22.3% · Voc 52.27 V · Isc 14.56 A · Vmp 43.42 V · Imp 13.38 A" },
          { label: "EMMBGH61445 (585W)", value: "η 22.4% · Voc 52.47 V · Isc 14.60 A · Vmp 43.62 V · Imp 13.46 A" },
        ],
      },
      {
        title: "Mechanical & Physical",
        rows: [
          { label: "Cell Type",           value: "N-Type TOPCon — 144 Half-Cut Mono-Crystalline Bifacial" },
          { label: "Dimensions (L×W×H)",  value: "2278 × 1134 × 35 mm" },
          { label: "Module Weight",       value: "32 kg" },
          { label: "Front / Back Glass",  value: "2 mm AR-coated · 2 mm Glass-to-Glass" },
          { label: "Encapsulant",         value: "EVA / POE / EPE" },
          { label: "Frame",               value: "Anodised Aluminium Alloy" },
          { label: "Junction Box",        value: "IP68" },
          { label: "Cable",               value: "500 mm · 4 mm² · MC4 compatible" },
          { label: "Max. System Voltage", value: "1500 V DC" },
          { label: "Max. Series Fuse",    value: "30 A" },
          { label: "Hail Resistance",     value: "25 mm @ 23 m/s" },
          { label: "Bifaciality Factor",  value: "80 ± 5%" },
        ],
      },
      {
        title: "Thermal Data",
        rows: [
          { label: "Temp. Coefficient of Pmax", value: "-0.29% / °C" },
          { label: "Temp. Coefficient of Voc",  value: "-0.25% / °C" },
          { label: "Temp. Coefficient of Isc",  value: "+0.045% / °C" },
          { label: "NOCT",                       value: "45 °C ± 2 °C" },
          { label: "Operating Temperature",     value: "-40 °C to +85 °C" },
        ],
      },
    ],
    applications: [
      "Residential rooftop solar systems",
      "Commercial rooftop solar (10 kW to 1 MW+)",
      "Industrial captive power plants",
      "Government institutional projects (DCR variant)",
      "Coastal & industrial pollution zone projects (G2G durability)",
      "Utility-scale ground-mounted arrays",
      "Off-grid solar systems",
    ],
    certifications: [
      "CE Marked · DNV Certified · TUV Rheinland Certified",
      "ISO 9001:2015 · ISO 14001:2015 · OHSAS 45000:2018",
      "DCR & Non-DCR variants available",
      "Manufacturer: Emmvee Photovoltaic Power Pvt. Ltd., Bengaluru",
    ],
    warranty: [
      { label: "Product Warranty",         value: "12 Years" },
      { label: "Performance Warranty",     value: "30 Years" },
      { label: "Year 1 Degradation Limit", value: "1.0%" },
      { label: "Annual Degradation (Y2–30)", value: "0.40% per year" },
      { label: "Output at Year 30",        value: "87.4% of rated" },
    ],
    downloads: [
      { label: "Titanium Duo Datasheet (PDF)",     type: "datasheet" },
      { label: "Warranty Document (PDF)",          type: "warranty" },
      { label: "TUV Certificate (PDF)",            type: "certificate" },
    ],
    faqs: [
      { q: "What does glass-to-glass mean and why does it matter?", a: "G2G replaces the conventional polymer backsheet with a second pane of tempered glass. This eliminates backsheet UV degradation and delamination — the most common long-term failure modes in Indian climates." },
      { q: "Is the DCR variant suitable for government tenders?", a: "Yes — the DCR variant meets Domestic Content Requirements for government tender submissions under various MNRE schemes." },
      { q: "Will this work in coastal or industrial pollution zones?", a: "Yes. The G2G construction and anodised aluminium frame provide superior corrosion resistance suitable for coastal and industrial environments." },
    ],
    tags: ["TOPCon", "Bifacial", "G2G", "DCR", "Non-DCR", "Made in India", "Coastal"],
    seo: {
      title: "Emmvee Titanium Duo 530–625 Wp TOPCon Glass-to-Glass Solar Panel | CSGPL",
      description:
        "Emmvee Titanium Duo N-Type TOPCon bifacial G2G solar panels 530–625 Wp. Up to 22.4% efficiency, IP68, 30-year warranty, PID resistant. DCR & Non-DCR variants.",
    },
  },

  /* ============ C.3 — RENEWSYS DESERV EXTREME 144X ============ */
  {
    id: "renewsys-deserv-extreme",
    slug: "renewsys-deserv-extreme-144x-565-590wp",
    categorySlug: "solar-panels",
    brand: "RenewSys",
    brandSlug: "renewsys",
    title: "DESERV Extreme 144X",
    subtitle: "565–590 Wp",
    technology: "N-Type TOPCon Bifacial Dual Glass · BIS Certified",
    shortDescription:
      "565–590 Wp N-Type TOPCon bifacial dual-glass modules on 144 M10R half-cut cells. 23.26% max efficiency, SOLARBUYER audited, two BIS registrations covering the full power range.",
    longDescription:
      "RenewSys occupies a unique position in India's solar supply chain as the country's first truly integrated solar manufacturer — producing encapsulants, backsheets and solar cells in-house in addition to modules. This vertical integration gives RenewSys control over the key materials that determine module efficiency, durability and consistency. SOLARBUYER's independent audit programme provides an additional layer of procurement assurance — verifying manufacturing process compliance, BOM and performance consistency.",
    image: "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "N-Type TOPCon bifacial dual-glass — 144 M10R half-cut cells",
      "Maximum efficiency: 23.26% (590 Wp variant)",
      "Power range: 565–590 Wp",
      "Low temperature coefficient: -0.29% / °C Pmax",
      "Bifaciality: 80 ± 5% (75 ± 5% for grid-print variant)",
      "2.0 mm AR-coated semi-tempered front + 2.0 mm rear glass",
      "Independently audited by SOLARBUYER",
      "Modern automated production — tight electrical binning",
      "IP68 split junction box · 3 bypass diodes",
      "MC4 connectors · 4.0 mm² cable",
      "Snow load 5400 Pa · Wind load 2400 Pa",
      "BIS Certified: R-63000760 & R-71018970",
      "12-yr product + 30-yr performance warranty",
    ],
    whyChoose:
      "RenewSys' vertical integration — producing encapsulants, backsheets and cells in-house — gives it control over the materials that determine long-term reliability. SOLARBUYER audit status provides additional procurement assurance for large commercial and utility buyers. Tight binning tolerances ensure consistent electrical performance batch to batch.",
    specs: [
      { label: "Power",       value: "565–590 Wp" },
      { label: "Efficiency",  value: "23.26%" },
      { label: "Technology",  value: "TOPCon M10R" },
      { label: "Cells",       value: "144 Half-Cut" },
      { label: "Warranty",    value: "12 + 30 yrs" },
      { label: "Origin",      value: "India · MH/TG" },
    ],
    specGroups: [
      {
        title: "Electrical (STC)",
        rows: [
          { label: "565 Wp", value: "Vmp 42.62 V · Imp 13.26 A · Voc 50.91 V · Isc 14.15 A" },
          { label: "570 Wp", value: "Vmp 42.88 V · Imp 13.30 A · Voc 51.23 V · Isc 14.19 A" },
          { label: "575 Wp", value: "Vmp 43.14 V · Imp 13.34 A · Voc 51.55 V · Isc 14.23 A" },
          { label: "580 Wp", value: "Vmp 43.40 V · Imp 13.38 A · Voc 51.87 V · Isc 14.27 A" },
          { label: "585 Wp", value: "Vmp 43.67 V · Imp 13.41 A · Voc 52.22 V · Isc 14.30 A" },
          { label: "590 Wp", value: "η 23.26% · Vmp 43.93 V · Imp 13.45 A · Voc 52.51 V · Isc 14.34 A" },
        ],
      },
      {
        title: "Mechanical & Operating",
        rows: [
          { label: "Cell Type",           value: "N-Type TOPCon — M10R 144 Half-Cut Bifacial" },
          { label: "Dimensions (L×W×H)",  value: "2277 × 1134 × 35 mm" },
          { label: "Module Weight",       value: "31.5 kg" },
          { label: "Front Glass",         value: "2.0 mm AR-Coated Semi-Tempered" },
          { label: "Back Glass",          value: "2.0 mm Semi-Tempered (Dual Glass)" },
          { label: "Frame",               value: "Anodised Aluminium Alloy" },
          { label: "Junction Box",        value: "IP68 — Split, 3 bypass diodes" },
          { label: "Cable",               value: "4.0 mm²" },
          { label: "Max. Wind Load",      value: "2400 Pa" },
          { label: "Max. Snow Load",      value: "5400 Pa" },
          { label: "Operating Temp.",     value: "-40 °C to +85 °C" },
          { label: "Max. System Voltage", value: "1500 V DC" },
          { label: "Max. Series Fuse",    value: "30 A" },
        ],
      },
      {
        title: "Thermal Data",
        rows: [
          { label: "Temp. Coefficient of Pmax", value: "-0.29% / °C" },
          { label: "Temp. Coefficient of Voc",  value: "-0.2764% / °C" },
          { label: "Temp. Coefficient of Isc",  value: "+0.0572% / °C" },
          { label: "NOCT",                       value: "45 °C ± 2 °C" },
        ],
      },
    ],
    applications: [
      "Utility-scale, commercial rooftop & general grid-connected solar",
      "Projects requiring BIS/ALMM documented compliance",
      "High-bifaciality installations — elevated frames over reflective ground",
      "Export-quality procurement with SOLARBUYER audit requirement",
    ],
    certifications: [
      "BIS — R-63000760 & R-71018970 (565–590 Wp)",
      "CE Certified",
      "Independently audited by SOLARBUYER",
      "ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018",
      "DCR & Non-DCR variants available",
    ],
    warranty: [
      { label: "Product Warranty",       value: "12 Years" },
      { label: "Performance Warranty",   value: "30 Years" },
    ],
    downloads: [
      { label: "DESERV Extreme Datasheet (PDF)", type: "datasheet" },
      { label: "BIS Certificate (PDF)",          type: "certificate" },
      { label: "SOLARBUYER Audit Report (PDF)",  type: "audit" },
    ],
    faqs: [
      { q: "What is SOLARBUYER audit and why does it matter?", a: "SOLARBUYER is an internationally recognised quality verification platform that independently audits manufacturers for process compliance, materials bill of materials, and performance consistency — providing additional procurement assurance for large buyers." },
      { q: "What is M10R cell size?", a: "M10R is a large rectangular wafer format that enables higher power density per module and lower BOS cost for utility-scale projects." },
    ],
    tags: ["TOPCon", "Bifacial", "BIS", "SOLARBUYER", "DCR", "Non-DCR", "M10R"],
    seo: {
      title: "RenewSys DESERV Extreme 144X 565–590 Wp TOPCon Bifacial · BIS Certified | CSGPL",
      description:
        "RenewSys DESERV Extreme 144X N-Type TOPCon bifacial solar panel 565–590 Wp. 23.26% efficiency, SOLARBUYER audited, BIS certified. DCR & Non-DCR. 30-yr warranty.",
    },
  },

  /* ============ D.1 — FESTON ENGIELD ON-GRID ============ */
  {
    id: "feston-engield-ongrid",
    slug: "feston-engield-on-grid-1.5kw-25kw",
    categorySlug: "inverters",
    brand: "Feston",
    brandSlug: "feston",
    title: "EnGield Series",
    subtitle: "On-Grid · 1.5–25 kW",
    technology: "Single & Three-Phase On-Grid String Inverters · 98.6% Peak Efficiency",
    shortDescription:
      "Complete on-grid string inverter range from 1.5 kW residential single-phase through 25 kW industrial three-phase. Zero-export, VSG support, IP65, 98.6% peak efficiency, 10-year warranty.",
    longDescription:
      "Feston has designed the EnGield Series to serve the full capacity spectrum of grid-tied solar within a single, consistently featured product family. This simplifies EPC project execution: the same commissioning process, the same monitoring platform, and the same service protocol apply across projects of very different sizes. The transformerless architecture reduces weight, improves efficiency, and eliminates the transformer as a mechanical wear component.",
    image: "https://images.pexels.com/photos/9799706/pexels-photo-9799706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Power range: 1.5 kW to 25 kW · Single & three-phase",
      "Transformerless topology — high efficiency, compact, lightweight",
      "Peak efficiency: up to 98.6% · Euro: 97.83% · MPPT: >99%",
      "1 MPPT (1-phase) / 2 MPPT trackers (3-phase)",
      "Zero-export application — DISCOM net-metering compliant",
      "VSG (Virtual Synchronous Generator) for grid stability",
      "Anti-PID function (optional)",
      "DC Type II / AC Type II surge protection — built in",
      "IP65 — outdoor wall-mount without enclosure",
      "Operating temp: -25 °C to +60 °C (derate above 45 °C)",
      "RS485 / RS232 / Wi-Fi / LAN communication",
      "Remote firmware upload + parameter adjustment",
      "Night standby consumption: <1 W",
      "10-year standard warranty",
    ],
    whyChoose:
      "Natural convection cooling on models up to 12 kW eliminates fan-related maintenance entirely. Smart (temperature-controlled) cooling on 15–25 kW models activates only when needed, extending fan life and reducing noise. Zero-export prevents reverse power flow into the distribution network — essential for commercial DISCOM connections that restrict grid export.",
    specs: [
      { label: "Power range",     value: "1.5–25 kW" },
      { label: "Peak efficiency", value: "98.6%" },
      { label: "Phase",           value: "1P & 3P" },
      { label: "MPPT",            value: "1 or 2" },
      { label: "Protection",      value: "IP65" },
      { label: "Warranty",        value: "10 Years" },
    ],
    specGroups: [
      {
        title: "Single Phase 1.5–4.2 kW (EnGield 1P-A)",
        rows: [
          { label: "FE-1.5", value: "Rated 1.5 kW · Max DC 2.0 kW · MPPT 70–500V · η 97.3% · 7.2 A AC" },
          { label: "FE-2.2", value: "Rated 2.2 kW · Max DC 2.9 kW · η 97.5% · 10.5 A AC" },
          { label: "FE-2.7", value: "Rated 2.7 kW · Max DC 3.5 kW · η 97.5% · 12.9 A AC" },
          { label: "FE-3.0", value: "Rated 3.0 kW · Max DC 3.9 kW · η 97.5% · 14.3 A AC" },
          { label: "FE-3.3", value: "Rated 3.3 kW · Max DC 4.3 kW · η 97.5% · 15.8 A AC" },
          { label: "FE-3.6", value: "Rated 3.6 kW · Max DC 4.7 kW · η 97.5% · 17.2 A AC" },
          { label: "FE-4.2", value: "Rated 4.2 kW · Max DC 5.2 kW · η 97.5% · 19.1 A AC" },
        ],
      },
      {
        title: "Single Phase 3.6–6.2 kW (EnGield 1P-B)",
        rows: [
          { label: "FE-3.6 / 4.0 / 4.6", value: "MPPT 70–550V · Max DC 600V · η 97.5%" },
          { label: "FE-5.0 / 5.2 / 6.0 / 6.2", value: "Max Active up to 6.82 kW · Euro η 97.0%" },
        ],
      },
      {
        title: "Three Phase 4–12 kW (EnGield 3P-A)",
        rows: [
          { label: "FE-4 / 5 / 6 / 7 / 8", value: "MPPT 120–1000V · 2 trackers · η 98.3% · Natural cooling" },
          { label: "FE-10 / 12",            value: "MPPT 200–1000V · 2 trackers · η 98.3%" },
        ],
      },
      {
        title: "Three Phase 15–25 kW (EnGield 3P-15 & 3P-B)",
        rows: [
          { label: "FE-15", value: "15 kW · MPPT 250–1000V · Smart cooling · η 98.3% · 22.7 A AC" },
          { label: "FE-18", value: "18 kW · MPPT 200–1000V · Smart cooling · η 98.6% · 27.3 A AC" },
          { label: "FE-20", value: "20 kW · MPPT 200–1000V · Smart cooling · η 98.6% · 30.3 A AC" },
          { label: "FE-25", value: "25 kW · MPPT 200–1000V · Smart cooling · η 98.6% · 37.9 A AC" },
        ],
      },
      {
        title: "Common General Data",
        rows: [
          { label: "Rated Output Voltage",  value: "220/230/240V (1P) · 220/380V or 230/400V 3L/N/PE (3P)" },
          { label: "Output Power Factor",   value: "0.8 leading to 0.8 lagging" },
          { label: "Grid Frequency",        value: "45–55 Hz or 55–65 Hz (optional)" },
          { label: "Grid Current THD",      value: "<3%" },
          { label: "DC Injection Current",  value: "<0.5%" },
          { label: "Topology",              value: "Transformerless" },
          { label: "Night Standby",         value: "<1 W" },
          { label: "Operating Temp.",       value: "-25 °C to +60 °C (derate above 45 °C)" },
          { label: "Operating Humidity",    value: "0–100%" },
          { label: "Display",               value: "LCD1602" },
          { label: "Communication",         value: "RS485 / RS232 / Wi-Fi / LAN" },
          { label: "Surge Protection",      value: "DC Type II / AC Type II — integrated" },
        ],
      },
    ],
    applications: [
      "Residential rooftop solar — 1.5–6 kW single-phase net-metering",
      "Commercial rooftop — 4–12 kW three-phase",
      "Industrial captive solar — 15–25 kW three-phase",
      "Institutional projects — schools, hospitals, government buildings",
      "Net-metering and zero-export restricted installations",
      "Projects requiring VSG grid-support functionality",
    ],
    certifications: [
      "IEC 61727 · IEC 62116 · CEI 0-21 · EN 50549",
      "NRS 097 · RD 140 · UNE 217002 · G98 · G99 · VDE-AR-N 4105",
      "IEC/EN 62109-1 · IEC/EN 62109-2",
      "IEC/EN 61000-6-1/2/3/4",
    ],
    warranty: [
      { label: "Standard Warranty", value: "10 Years" },
      { label: "Extended Options",  value: "Available on request" },
    ],
    downloads: [
      { label: "EnGield Series Catalog (PDF)",      type: "datasheet" },
      { label: "Wiring & Installation Guide (PDF)", type: "manual" },
      { label: "Compliance Certificates (PDF)",     type: "certificate" },
    ],
    faqs: [
      { q: "What is zero-export and why do I need it?", a: "Zero-export prevents reverse power flow into the grid — required by many DISCOMs for commercial installations without net metering. EnGield supports this natively." },
      { q: "What is VSG support?", a: "Virtual Synchronous Generator emulates the inertia characteristics of conventional generators, improving compatibility with weak grids and microgrids." },
      { q: "Should I pick 1P or 3P?", a: "Single-phase (1.5–6.2 kW) is appropriate for residential and small commercial. Three-phase (4–25 kW) is required for larger commercial and industrial installations with three-phase utility connections." },
    ],
    tags: ["On-Grid", "Single-Phase", "Three-Phase", "Zero-Export", "VSG", "IP65", "Transformerless"],
    seo: {
      title: "Feston EnGield On-Grid Solar Inverter 1.5–25 kW · 1P & 3P · 10-Year Warranty | CSGPL",
      description:
        "Feston EnGield on-grid string inverters 1.5–25 kW. Single & three-phase, 98.6% efficiency, zero-export, IP65, 10-year warranty. Residential, commercial & industrial solar.",
    },
  },

  /* ============ D.2 — FESTON VEGA HYBRID ============ */
  {
    id: "feston-vega-hybrid",
    slug: "feston-vega-hybrid-3kw-20kw",
    categorySlug: "inverters",
    brand: "Feston",
    brandSlug: "feston",
    title: "Vega Series",
    subtitle: "Hybrid · 3–20 kW",
    technology: "Single & Three-Phase Hybrid Inverters with Battery Storage",
    shortDescription:
      "Single-phase (3–6 kW) and three-phase (10–20 kW) hybrid inverters that integrate grid-tied conversion with battery management. 10 ms switchover, 150% overload, TOU scheduling, 10-year warranty.",
    longDescription:
      "A hybrid inverter bridges the gap between standard on-grid and off-grid systems. The Vega Series handles the full management loop: harvesting solar, supplying loads directly, charging batteries, exporting surplus to the grid, and drawing from battery or grid during shortfalls — all automatic and configurable through Time-of-Use scheduling. The 10 ms switchover to battery backup is fast enough for sensitive loads without a separate UPS.",
    image: "https://images.pexels.com/photos/8853509/pexels-photo-8853509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Power range: 3–6 kW (1P) and 10–20 kW (3P)",
      "Inverter efficiency: 98%",
      "Switchover to battery: 10 ms — sensitive load continuity",
      "150% overloading — handles motor/compressor starts",
      "Time-of-Use (TOU) energy scheduling",
      "Anti-islanding protection",
      "1P models: LV Lithium 51.2 V · 1 battery input · 6 units parallel",
      "3P models: HV Lithium 150–200 V · 2 battery inputs · 15 units parallel",
      "100% unbalanced load support (3P models)",
      "Supports old + new battery packs on the same inverter",
      "RS485 · CAN · DRED · Dry Contact · Parallel Port",
      "Wi-Fi · 4G · Bluetooth · LED · App monitoring",
      "IP65 ingress protection",
      "10-year warranty",
    ],
    whyChoose:
      "150% overloading capacity allows brief startup current surges from motors and compressors without tripping — critical in commercial environments. Supporting old and new battery packs on the same inverter gives upgrade flexibility for future capacity expansion. 100% unbalanced load support on three-phase models handles asymmetric loads common in mixed residential/commercial premises.",
    specs: [
      { label: "Power range",    value: "3–20 kW" },
      { label: "Efficiency",     value: "98%" },
      { label: "Switchover",     value: "10 ms" },
      { label: "Overload",       value: "150%" },
      { label: "Battery",        value: "LV & HV Li" },
      { label: "Warranty",       value: "10 Years" },
    ],
    specGroups: [
      {
        title: "Vega Single Phase (3–6 kW)",
        rows: [
          { label: "FV-3-1P-HB",    value: "3 kW · 13.6 A · Max PV 4500 Wp · MPPT 80–550V · 75 A charge · η 97.5%" },
          { label: "FV-3.6-1P-HB",  value: "3.6 kW · 16.4 A · Max PV 6000 Wp · 85 A charge · η 97.8%" },
          { label: "FV-4-1P-HB",    value: "4 kW · 18.2 A · Max PV 6000 Wp · 85 A charge · η 97.8%" },
          { label: "FV-4.6-1P-HB",  value: "4.6 kW · 20.8 A · Max PV 7500 Wp · 100 A charge · η 97.8%" },
          { label: "FV-5-1P-HB",    value: "5 kW · 22.7 A · Max PV 7500 Wp · 100 A charge · η 98.0%" },
          { label: "FV-6-1P-HB",    value: "6 kW · 27.2 A · Max PV 9000 Wp · IP65" },
        ],
      },
      {
        title: "Vega Three Phase (10–20 kW)",
        rows: [
          { label: "FV-10-3P-HB", value: "10 kW · 15.4 A · Max PV 15000 Wp · 2 MPPT (180–960V) · 25+25 A charge · η 98.2%" },
          { label: "FV-12-3P-HB", value: "12 kW · 18.4 A · Max PV 18000 Wp · 25+25 A · η 97.7%" },
          { label: "FV-15-3P-HB", value: "15 kW · 22.5 A · Max PV 22500 Wp · MPPT 350–850V · 35+35 A · η 97.8%" },
          { label: "FV-18-3P-HB", value: "18 kW · 27.0 A · Max PV 27000 Wp · MPPT 410–850V · 35+35 A" },
          { label: "FV-20-3P-HB", value: "20 kW · 30.0 A · Max PV 30000 Wp · MPPT 450–850V · 35+35 A" },
        ],
      },
      {
        title: "Common General Data",
        rows: [
          { label: "Grid Voltage (1P)",      value: "184–270 V" },
          { label: "Grid Voltage (3P)",      value: "184–276 V / 320–480 V" },
          { label: "Frequency Range",        value: "45–65 Hz" },
          { label: "Switchover to Battery",  value: "10 ms" },
          { label: "Overloading Capacity",   value: "150%" },
          { label: "Communication (Control)", value: "RS485 / CAN / DRED / Dry Contact / Parallel Port" },
          { label: "Monitoring",             value: "LED / App / Wi-Fi / 4G / Bluetooth" },
          { label: "IP Rating",              value: "IP65" },
          { label: "3P Size (W×H×D)",        value: "575 × 509 × 210 mm" },
          { label: "3P Weight",              value: "35 kg" },
        ],
      },
    ],
    applications: [
      "Residential solar with battery backup — 3–6 kW single-phase",
      "Commercial premises energy storage — 10–20 kW three-phase",
      "Time-of-Use management for peak tariff exposure",
      "Critical load backup — clinics, offices, data rooms, cold chains",
      "Parallel inverter arrays for scalable commercial battery storage",
      "100% unbalanced three-phase load installations",
    ],
    certifications: [
      "IEC 62109-1 · IEC 62109-2 · EN 62109-1 · EN 62109-2",
      "EN61000-4-1/2/3/4 · EN61000-6-2/4 · EN61000-6-1/3",
      "VDE-AR-N 4105 · G98/G99 · CEI 0-21 · EN50540",
      "NRS 097-2-1 · AS 4777.2 · UNE217001/217002 · NTS 2.1",
      "CE LVD · CE EMC",
    ],
    warranty: [
      { label: "Standard Warranty", value: "10 Years" },
    ],
    downloads: [
      { label: "Vega Series Catalog (PDF)",          type: "datasheet" },
      { label: "Battery Compatibility Guide (PDF)",  type: "guide" },
      { label: "TOU Configuration Manual (PDF)",     type: "manual" },
    ],
    faqs: [
      { q: "Should I get a hybrid inverter or a separate battery system later?", a: "Hybrid is more cost-effective and efficient than retrofitting batteries to an on-grid inverter. It also avoids double conversion losses." },
      { q: "What is TOU and how does it save money?", a: "Time-of-Use scheduling charges your battery from solar/grid when tariffs are cheap and discharges during peak tariff hours — directly reducing your electricity bill on TOU tariff structures." },
    ],
    tags: ["Hybrid", "Battery Backup", "Single-Phase", "Three-Phase", "TOU", "150% Overload"],
    seo: {
      title: "Feston Vega Hybrid Solar Inverter 3–20 kW · Battery + Solar · 10-Year Warranty | CSGPL",
      description:
        "Feston Vega hybrid inverters 3–20 kW with solar + battery storage. 10 ms switchover, 150% overloading, TOU management, LV/HV battery support. 1P & 3P.",
    },
  },

  /* ============ D.3 — MICROTEK OFF-GRID MPPT ============ */
  {
    id: "microtek-offgrid-mppt-5kva",
    slug: "microtek-solar-offgrid-mppt-5kva-48v",
    categorySlug: "inverters",
    brand: "Microtek",
    brandSlug: "microtek",
    title: "Solar Off-Grid MPPT Inverter",
    subtitle: "5 kVA / 5000 W · 48 V",
    technology: "Pure Sine Wave Off-Grid Inverter with Built-in MPPT Charger",
    shortDescription:
      "5 kVA pure sine wave off-grid inverter with built-in 4500 W MPPT solar charger. Supports lithium-ion & lead-acid, parallel up to 45 kVA, 10 ms transfer. For homes, shops & rural electrification.",
    longDescription:
      "The Microtek Solar Off-Grid MPPT Inverter combines a 5 kVA pure sine wave power inverter with a built-in 4500 W MPPT solar charge controller. It supports both lithium-ion and lead-acid batteries, offers configurable AC/Solar input priority, and enables parallel operation up to 45 kVA — making it suitable for everything from residential off-grid systems through small commercial installations.",
    image: "https://images.pexels.com/photos/9799712/pexels-photo-9799712.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "5 kVA / 5000 W pure sine wave output",
      "Built-in MPPT Solar Charge Controller — 4500 W max PV",
      "Compatible with Lithium-Ion and Lead-Acid batteries",
      "Selectable high-power charging — up to 80 A solar / 80 A AC",
      "MPPT Operating Voltage: 120–430 V DC · Max PV OCV 450 V DC",
      "Configurable AC / Solar input priority",
      "Smart battery charging — float, bulk, absorption stages",
      "Cold start function — operates without grid or battery input",
      "Auto restart on AC recovery",
      "Parallel operation — up to 45 kVA total",
      "Transfer time: 10 ms (PC loads) / 20 ms (home appliances)",
      "LCD display with full system monitoring",
      "USB & RS232 communication · Optional Wi-Fi / SNMP / Modbus",
    ],
    whyChoose:
      "The cold start function means the inverter can power loads from solar alone — no grid, no battery required at start-up — a critical capability for off-grid and remote installations. Parallel operation up to 45 kVA enables scalable system growth without replacing the existing inverter. The pure sine wave output is safe for all sensitive electronics including computers and medical equipment.",
    specs: [
      { label: "Capacity",     value: "5 kVA / 5000 W" },
      { label: "Output",       value: "Pure Sine Wave" },
      { label: "Battery",      value: "48 V · Li / Lead-Acid" },
      { label: "Max PV",       value: "4500 W" },
      { label: "Parallel",     value: "Up to 45 kVA" },
      { label: "Efficiency",   value: "90%" },
    ],
    specGroups: [
      {
        title: "AC Input",
        rows: [
          { label: "Nominal AC Input Voltage",  value: "230 V AC" },
          { label: "Selectable Voltage Range",  value: "170–280 V AC" },
          { label: "AC Frequency Range",        value: "50 Hz / 60 Hz" },
        ],
      },
      {
        title: "Output",
        rows: [
          { label: "Output Voltage",    value: "230 V AC ± 5%" },
          { label: "Waveform",          value: "Pure Sine Wave" },
          { label: "Surge Capacity",    value: "2× Rated Power for 10 seconds" },
          { label: "Efficiency",        value: "90%" },
          { label: "Transfer Time",     value: "10 ms (PC) · 20 ms (home appliances)" },
        ],
      },
      {
        title: "Battery",
        rows: [
          { label: "Battery Voltage",            value: "48 V DC" },
          { label: "Recommended Capacity",       value: "200 Ah" },
          { label: "Charging Voltage",           value: "54 V DC" },
          { label: "Float Voltage",              value: "60 V DC" },
          { label: "Overcharge Protection",      value: "63 V DC" },
          { label: "Compatible Battery Types",   value: "Lithium-Ion · Lead-Acid" },
        ],
      },
      {
        title: "Solar Charger (MPPT)",
        rows: [
          { label: "Charger Type",               value: "MPPT" },
          { label: "Maximum PV Array Power",     value: "4500 W" },
          { label: "MPPT Operating Voltage",     value: "120–430 V DC" },
          { label: "Maximum PV Open Circuit V",  value: "450 V DC" },
          { label: "Maximum Solar Charge Current", value: "80 A" },
          { label: "Maximum AC Charge Current",  value: "80 A" },
        ],
      },
      {
        title: "Physical & Environmental",
        rows: [
          { label: "Dimensions (L×W×H)",     value: "120 × 295 × 468 mm" },
          { label: "Weight",                 value: "11 kg" },
          { label: "Operating Temperature",  value: "-10 °C to +50 °C" },
          { label: "Storage Temperature",    value: "-15 °C to +60 °C" },
          { label: "Operating Humidity",     value: "5% to 95% RH (non-condensing)" },
          { label: "Communication",          value: "USB · RS232 · Optional Wi-Fi/SNMP/Modbus" },
          { label: "Parallel Operation",     value: "Up to 45 kVA total" },
        ],
      },
    ],
    applications: [
      "Home solar backup systems — single phase residential",
      "Rural electrification — off-grid households",
      "Shops and offices — solar-powered backup for commercial premises",
      "Small commercial battery storage with solar input",
      "Off-grid installations where grid is unavailable or unreliable",
    ],
    certifications: [
      "Manufacturer: Microtek — Indian power electronics brand",
    ],
    warranty: [
      { label: "Warranty", value: "As per Microtek standard policy" },
    ],
    downloads: [
      { label: "Microtek 5KVA Datasheet (PDF)", type: "datasheet" },
      { label: "Installation Manual (PDF)",     type: "manual" },
    ],
    faqs: [
      { q: "Can I run this without batteries?", a: "Yes — the cold start function enables operation from solar input alone for daytime loads. Batteries are recommended for evening backup." },
      { q: "How does parallel operation work?", a: "Multiple units can be connected in parallel up to 45 kVA total, enabling scalable capacity growth as your power needs increase." },
    ],
    tags: ["Off-Grid", "MPPT", "Pure Sine Wave", "5KVA", "Parallel", "Lithium", "Lead-Acid"],
    seo: {
      title: "Microtek Solar Off-Grid MPPT Inverter 5KVA 48V · Pure Sine Wave | CSGPL",
      description:
        "Microtek 5 kVA 48 V off-grid solar MPPT inverter. Pure sine wave, 4500 W PV input, 80 A MPPT charger, Li-Ion & Lead-Acid compatible, 45 kVA parallel.",
    },
  },

  /* ============ E.1 — FESTON VEGA LV BATTERY ============ */
  {
    id: "feston-vega-lv-lithium",
    slug: "feston-vega-lv-lithium-battery-51.2v",
    categorySlug: "batteries",
    brand: "Feston Vega Compatible",
    brandSlug: "feston",
    title: "LV Lithium-Ion Battery",
    subtitle: "51.2 V · For Vega 1P Hybrid",
    technology: "Low-Voltage Lithium-Ion Energy Storage System",
    shortDescription:
      "51.2 V nominal LV lithium-ion battery for Feston Vega single-phase hybrid inverters. 42–58 V operating range, up to 100 A charge/discharge, parallel expansion to 6 inverters.",
    longDescription:
      "Designed for the Feston Vega single-phase hybrid inverter range (3–6 kW), this LV lithium-ion battery provides reliable energy storage with seamless integration via CAN/RS485 communication. The 42–58 V operating range and up to 100 A charge/discharge current support the full capacity range of Vega 1P models, with parallel battery expansion enabling scalable storage growth.",
    image: "https://images.pexels.com/photos/8853509/pexels-photo-8853509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Battery Type: Lithium-Ion (LV)",
      "Nominal Voltage: 51.2 V",
      "Operating Range: 42 V – 58 V",
      "Max Charging Voltage: ≤ 60 V",
      "Charge/Discharge: 75 A (FV-3) · 85 A (FV-3.6/4) · 100 A (FV-4.6/5)",
      "Max Charging Efficiency: 95.0–95.2%",
      "Compatible Inverters: Feston Vega 1P Hybrid (3–6 kW)",
      "Parallel battery expansion supported",
      "Up to 6 inverters in parallel for storage scaling",
      "Communication: CAN / RS485",
      "Integrated BMS protection",
    ],
    whyChoose:
      "Designed specifically for the Vega 1P inverter line — communication protocols, voltage windows and charge profiles are factory-matched. Scalable parallel expansion lets you grow storage capacity as energy needs increase without replacing existing infrastructure.",
    specs: [
      { label: "Type",       value: "Lithium-Ion LV" },
      { label: "Voltage",    value: "51.2 V Nominal" },
      { label: "Range",      value: "42–58 V" },
      { label: "Charge",     value: "Up to 100 A" },
      { label: "Efficiency", value: "95.2%" },
      { label: "Comms",      value: "CAN / RS485" },
    ],
    specGroups: [
      {
        title: "Electrical",
        rows: [
          { label: "Battery Type",              value: "Lithium-Ion (LV — Low Voltage)" },
          { label: "Nominal Battery Voltage",   value: "51.2 V" },
          { label: "Battery Voltage Range",     value: "42 V – 58 V" },
          { label: "Maximum Charging Voltage",  value: "≤ 60 V" },
          { label: "Max Continuous Charge",     value: "75 A (FV-3) / 85 A (FV-3.6/4) / 100 A (FV-4.6/5)" },
          { label: "Max Continuous Discharge",  value: "Matches charge rating" },
          { label: "Max Charging Efficiency",   value: "95.0–95.2%" },
        ],
      },
      {
        title: "System Integration",
        rows: [
          { label: "Compatible Inverters",      value: "Feston Vega — FV-3 / 3.6 / 4 / 4.6 / 5 / 6-1P-HB" },
          { label: "Battery Parallel Expansion", value: "Yes — up to 6 inverter parallel count" },
          { label: "Communication Protocol",    value: "CAN / RS485" },
          { label: "BMS",                       value: "Integrated — protection per Vega datasheet" },
        ],
      },
    ],
    applications: [
      "Residential solar battery backup — 3–6 kW single-phase",
      "Energy storage for TOU optimisation on net-metering connections",
      "Scalable storage with parallel Vega 1P inverter configurations",
    ],
    certifications: [
      "Compatible with Vega 1P series safety standards",
    ],
    warranty: [
      { label: "Warranty", value: "As per manufacturer policy — confirm at order" },
    ],
    downloads: [
      { label: "Vega LV Compatibility Guide (PDF)", type: "guide" },
    ],
    faqs: [
      { q: "Is this an LFP battery?", a: "Battery chemistry is Lithium-Ion (LV). Confirm specific LFP/NMC chemistry with Feston before order — LFP is preferred for solar storage." },
      { q: "Can I add more batteries later?", a: "Yes — parallel expansion is supported up to 6 inverter parallel count, enabling scalable storage growth." },
    ],
    tags: ["LV", "Lithium-Ion", "51.2V", "Vega Compatible", "Parallel", "BMS"],
    seo: {
      title: "Feston Vega LV Lithium Battery 51.2V · For 1P Hybrid Inverters | CSGPL",
      description:
        "Low-voltage 51.2 V lithium-ion battery for Feston Vega 1P hybrid inverters. 42–58 V range, up to 100 A charge, parallel expansion, CAN/RS485 comms.",
    },
  },

  /* ============ E.2 — FESTON VEGA HV BATTERY ============ */
  {
    id: "feston-vega-hv-lithium",
    slug: "feston-vega-hv-lithium-battery-150-200v",
    categorySlug: "batteries",
    brand: "Feston Vega Compatible",
    brandSlug: "feston",
    title: "HV Lithium-Ion Battery",
    subtitle: "150–200 V · For Vega 3P Hybrid",
    technology: "High-Voltage Lithium-Ion Energy Storage System",
    shortDescription:
      "High-voltage 150–200 V lithium-ion battery for Feston Vega three-phase hybrid inverters (10–20 kW). Dual battery inputs, scalable to 15-unit parallel, reduced cable losses.",
    longDescription:
      "The HV battery architecture reduces battery-side cable losses and enables efficient management of larger energy storage capacities suited to commercial and light-industrial applications. Two independent battery inputs per inverter and parallel scaling up to 15 units make this the right choice for substantial commercial storage installations.",
    image: "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Battery Type: Lithium-Ion (HV — High Voltage)",
      "Voltage Range: 150 V – 200 V",
      "2 independent battery inputs per inverter",
      "Peak charge/discharge: 25 A per input (FV-10/12) · 35 A per input (FV-15/18/20)",
      "Compatible Inverters: Feston Vega 3P Hybrid (10–20 kW)",
      "Parallel scaling: Up to 15 inverter units",
      "Communication: CAN / RS485",
      "Integrated BMS protection",
      "Reduced battery-side cable losses",
    ],
    whyChoose:
      "High-voltage architecture reduces battery-side cable losses significantly — important for commercial installations where battery-to-inverter cable runs may be longer. Dual independent battery inputs enable phased capacity additions and redundancy.",
    specs: [
      { label: "Type",       value: "Lithium-Ion HV" },
      { label: "Range",      value: "150–200 V" },
      { label: "Inputs",     value: "2 per inverter" },
      { label: "Charge",     value: "Up to 35 A" },
      { label: "Parallel",   value: "Up to 15 units" },
      { label: "Comms",      value: "CAN / RS485" },
    ],
    specGroups: [
      {
        title: "Electrical",
        rows: [
          { label: "Battery Type",              value: "Lithium-Ion (HV — High Voltage)" },
          { label: "Battery Voltage Range",     value: "150 V – 200 V" },
          { label: "Battery Inputs / Inverter", value: "2 independent" },
          { label: "Peak Charge/Discharge",     value: "25 A per input (FV-10/12) · 35 A per input (FV-15/18/20)" },
        ],
      },
      {
        title: "System Integration",
        rows: [
          { label: "Compatible Inverters",      value: "Feston Vega 3P — FV-10/12/15/18/20-3P-HB" },
          { label: "Parallel for Expansion",    value: "Up to 15 inverter units" },
          { label: "Communication Protocol",    value: "CAN / RS485" },
          { label: "BMS",                       value: "Integrated — refer Vega 3P datasheet" },
        ],
      },
    ],
    applications: [
      "Commercial building energy storage — 10–20 kW three-phase",
      "Industrial peak demand reduction with solar + storage",
      "Large residential complexes / apartment common area supply",
      "C&I projects requiring scalable parallel battery storage",
    ],
    certifications: [
      "Compatible with Vega 3P series safety standards",
    ],
    warranty: [
      { label: "Warranty", value: "As per manufacturer policy — confirm at order" },
    ],
    downloads: [
      { label: "Vega HV Compatibility Guide (PDF)", type: "guide" },
    ],
    faqs: [
      { q: "Why HV instead of LV for commercial?", a: "HV reduces battery-side cable losses, allowing efficient management of larger capacities. For 10 kW+ installations the cable savings and efficiency gains favour HV architectures." },
    ],
    tags: ["HV", "Lithium-Ion", "150-200V", "Vega 3P", "Commercial", "Parallel"],
    seo: {
      title: "Feston Vega HV Lithium Battery 150–200V · For 3P Hybrid Inverters | CSGPL",
      description:
        "High-voltage 150–200 V lithium-ion battery for Feston Vega 3P hybrid inverters. Dual inputs, parallel to 15 units, CAN/RS485, ideal for commercial storage.",
    },
  },

  /* ============ F.1 — GI MOUNTING STRUCTURES ============ */
  {
    id: "gi-mounting-structures",
    slug: "gi-solar-mounting-structures",
    categorySlug: "solar-bos",
    brand: "TATA · Apollo Steel",
    brandSlug: "tata-apollo",
    title: "GI Solar Mounting Structures",
    subtitle: "Pre-GI & Hot-Dip GI",
    technology: "Engineered Solar Structure Systems — Rooftop, Ground & Carport",
    shortDescription:
      "Pre-galvanised & hot-dip GI mounting structures from TATA & Apollo Steel raw material. Custom-designed per project, IS 800/IS 875 compliant, wind-rated up to 180 km/h, drawings provided.",
    longDescription:
      "Our GI solar mounting structures are engineered using premium-grade TATA and Apollo Steel for rooftop (RCC, trapezoidal, tin sheet), ground-mounted, carport, elevated canal-top and parking shade applications. Pre-galvanised for standard inland environments, hot-dip galvanised (HDG, minimum 85 microns) for coastal, industrial and high-humidity zones. Custom engineering drawings and load calculations are provided as standard.",
    image: "https://images.pexels.com/photos/7102661/pexels-photo-7102661.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Raw material: TATA Steel / Apollo Steel",
      "Pre-Galvanised (Pre-Dip) for inland environments",
      "Hot-Dip Galvanised (HDG, ≥85 microns) for coastal/industrial",
      "Wind design up to 180 km/h (IS 875 Part 3)",
      "Structural design per IS 800",
      "Custom tilt: 5°–30° fixed or adjustable",
      "Compatible with all modules up to 2400 × 1200 mm",
      "End/mid clamps in HDG / SS 304 / SS 316",
      "HDG or SS 304/316 fasteners",
      "Custom engineering drawings + CAD + BOM per project",
      "Rooftop · Ground · Carport · Canal-top · Elevated",
      "Single-axis tracker compatible",
    ],
    whyChoose:
      "Structural reliability is critical to solar project longevity. Our mounting systems are engineered for Indian environmental conditions and project-specific load calculations are provided as standard. HDG provides enhanced corrosion protection for coastal & industrial environments where pre-galvanised alone won't last 25 years.",
    specs: [
      { label: "Material",        value: "GI · TATA/Apollo" },
      { label: "Galvanisation",   value: "Pre-GI / HDG" },
      { label: "HDG coating",     value: "≥ 85 microns" },
      { label: "Wind design",     value: "180 km/h" },
      { label: "Standards",       value: "IS 800 / IS 875" },
      { label: "Tilt",            value: "5°–30°" },
    ],
    specGroups: [
      {
        title: "Material & Standards",
        rows: [
          { label: "Structure Material",     value: "Galvanised Iron (GI)" },
          { label: "Raw Material Brands",    value: "TATA Steel and Apollo Steel" },
          { label: "Galvanisation Types",    value: "Pre-Galvanised (Pre-Dip) · Hot-Dip Galvanised (HDG)" },
          { label: "HDG Coating Standard",   value: "IS 2629 / IS 4759 — minimum 85 microns" },
          { label: "Structural Design",      value: "IS 800 — General construction in steel" },
          { label: "Wind Load Design",       value: "IS 875 Part 3 — up to 180 km/h design wind speed" },
        ],
      },
      {
        title: "Compatibility & Configuration",
        rows: [
          { label: "Structure Types",        value: "Rooftop (RCC / Trapezoidal / Sheet metal) · Ground Mount · Carport · Canal Top · Elevated" },
          { label: "Tilt Options",           value: "Fixed 5°–30° · Adjustable · Single-Axis Tracker Compatible" },
          { label: "Module Compatibility",   value: "All standard framed modules (up to 2400 × 1200 mm)" },
          { label: "Fastener Standard",      value: "Hot-Dip Galvanised or SS 304/316" },
          { label: "Drawings Provided",      value: "CAD drawings · Load calculations · Foundation design (per project)" },
        ],
      },
    ],
    applications: [
      "Residential rooftop solar",
      "Commercial rooftop solar",
      "Industrial solar projects",
      "Ground-mounted solar plants",
      "Solar carports & parking shades",
      "Canal-top solar installations",
    ],
    certifications: [
      "IS 800 (Structural)",
      "IS 875 Part 3 (Wind Load)",
      "IS 2629 / IS 4759 (HDG Coating)",
    ],
    warranty: [
      { label: "Structural Warranty", value: "Project-specific per design contract" },
    ],
    downloads: [
      { label: "Structure Type Selection Guide (PDF)", type: "guide" },
      { label: "Load Calculation Template (PDF)",      type: "template" },
    ],
    faqs: [
      { q: "When should I choose HDG over Pre-GI?", a: "HDG is required for coastal areas (within 5 km of saltwater), industrial pollution zones, and any installation where the structure will be exposed to ≥80% humidity for prolonged periods. Pre-GI is suitable for inland, low-pollution environments." },
      { q: "What's the maximum wind speed it can handle?", a: "Standard designs are rated to 180 km/h per IS 875 Part 3. Higher ratings are available for cyclone-prone coastal zones with project-specific engineering." },
    ],
    tags: ["Rooftop", "Ground", "Carport", "HDG", "Pre-GI", "TATA", "Apollo", "Custom"],
    seo: {
      title: "GI Solar Mounting Structures · TATA & Apollo Steel · 180 km/h Wind | CSGPL",
      description:
        "Pre-galvanised & hot-dip GI solar mounting structures from TATA & Apollo Steel. Wind-rated 180 km/h, IS 800 & IS 875 compliant. Rooftop, ground, carport, canal-top.",
    },
  },

  /* ============ F.2 — ACDB & DCDB BOXES ============ */
  {
    id: "acdb-dcdb-boxes",
    slug: "acdb-dcdb-protection-boxes",
    categorySlug: "solar-bos",
    brand: "Havells · Elmex",
    brandSlug: "havells",
    title: "ACDB & DCDB Protection Boxes",
    subtitle: "Custom Fabricated · 1000V / 1500V DC",
    technology: "Custom-Fabricated AC & DC Protection Distribution Boxes",
    shortDescription:
      "Custom-fabricated ACDB and DCDB protection boxes with Havells MCBs/MCCBs, Elmex terminals, Type II SPDs in IP65/IP66 powder-coated enclosures. 1000V / 1500V DC rated, project-specific.",
    longDescription:
      "ACDB and DCDB boxes provide switching, protection and metering functions at the inverter-AC interface (ACDB) and PV string-DC bus interface (DCDB). All boxes are assembled using components from Havells, Elmex and other reputed manufacturers, housed in IP65/IP66 powder-coated enclosures and custom-fabricated per project kWp, inverter model and string count.",
    image: "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "MCBs/MCCBs: Havells (or equivalent reputed brand)",
      "Terminal Blocks: Elmex (or equivalent)",
      "SPDs: Type 1 & Type 2 as per site requirements",
      "DC String Fuses and String Diodes",
      "DC Isolators: 1000 V / 1500 V DC rated",
      "AC Isolators per inverter output spec",
      "Enclosure: IP65 / IP66 powder-coated mild steel or GRP",
      "Wall-mount or pole-mount (project-specific)",
      "Custom-fabricated per kWp / inverter / string count",
    ],
    whyChoose:
      "Off-the-shelf distribution boxes often skimp on the protection components that determine long-term reliability. Custom fabrication using branded MCBs/MCCBs, Elmex terminals and verified SPDs ensures the protection actually works when required — and that components are field-serviceable.",
    specs: [
      { label: "MCB brand",      value: "Havells" },
      { label: "Terminals",      value: "Elmex" },
      { label: "DC voltage",     value: "1000/1500 V" },
      { label: "SPD",            value: "Type 1/2" },
      { label: "Enclosure",      value: "IP65/IP66" },
      { label: "Customisation",  value: "Per project" },
    ],
    specGroups: [
      {
        title: "Components",
        rows: [
          { label: "MCB / MCCB Brand",    value: "Havells (or equivalent reputed brand)" },
          { label: "Terminal Block Brand", value: "Elmex (or equivalent)" },
          { label: "SPD Rating",          value: "Type 1 and/or Type 2 as per design" },
          { label: "DC String Fuses",     value: "Project-specific" },
          { label: "DC Isolators",        value: "1000 V DC or 1500 V DC" },
          { label: "AC Isolators",        value: "Per inverter AC output current/voltage" },
        ],
      },
      {
        title: "Enclosure",
        rows: [
          { label: "Enclosure Protection", value: "IP65 / IP66" },
          { label: "Enclosure Material",   value: "Powder-coated mild steel or GRP" },
          { label: "Mounting",             value: "Wall-mount or pole-mount" },
          { label: "Customisation",        value: "Per system kWp, inverter type and string configuration" },
        ],
      },
    ],
    applications: [
      "Inverter-AC interface protection (ACDB)",
      "PV string-DC bus interface protection (DCDB)",
      "Commercial and industrial solar installations",
      "Multi-inverter installations requiring central protection",
    ],
    certifications: [
      "Component-level certifications per Havells / Elmex datasheets",
      "Enclosure protection: IP65 / IP66",
    ],
    warranty: [
      { label: "Box Assembly",    value: "1 Year workmanship" },
      { label: "Component Warranty", value: "Per Havells / Elmex standard policy" },
    ],
    downloads: [
      { label: "ACDB/DCDB Specification Form (PDF)", type: "form" },
      { label: "Sample Wiring Diagram (PDF)",        type: "diagram" },
    ],
    faqs: [
      { q: "Do I need both ACDB and DCDB?", a: "Yes — for grid-connected installations, both are required: DCDB protects the DC string side, ACDB protects the AC output side of the inverter. Some inverters integrate DC protection but external ACDB is still required." },
    ],
    tags: ["ACDB", "DCDB", "Havells", "Elmex", "SPD", "1500V DC", "IP65", "Custom"],
    seo: {
      title: "ACDB DCDB Solar Protection Boxes · Havells · Elmex · 1500V DC | CSGPL",
      description:
        "Custom-fabricated ACDB & DCDB protection boxes with Havells MCBs/MCCBs, Elmex terminals, Type II SPDs in IP65/IP66 enclosures. 1000/1500 V DC. Project-specific.",
    },
  },

  /* ============ F.3 — MICROTEK SOLAR DC CABLE ============ */
  {
    id: "microtek-solar-dc-cable",
    slug: "microtek-solar-dc-cable-4-6sqmm",
    categorySlug: "solar-bos",
    brand: "Microtek",
    brandSlug: "microtek",
    title: "Microtek Solar DC Cable",
    subtitle: "4 mm² / 6 mm² · 1500 V DC",
    technology: "TUV & IEC 62930 Certified Solar-Grade DC Cable · 30-Year Service Life",
    shortDescription:
      "Microtek solar-grade DC cable for string and array wiring. 101% IACS copper conductivity, XLHF insulation, UV/ozone-resistant sheath. 1500 V DC, EN 50618 / IEC 62930 tested. 30-year designed service life.",
    longDescription:
      "Microtek solar cables feature flexible electrolytic tinned fine-copper strands at 101% IACS conductivity, crosslinked halogen-free flame-retardant insulation, and a UV/ozone-resistant outer sheath — rated for 1500 V DC systems and tested to EN 50618 / IEC 62930 standards. Suitable for permanent outdoor long-term use under variable and harsh climate conditions with a designed operating life of 30 years.",
    image: "https://images.pexels.com/photos/9799712/pexels-photo-9799712.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "Energy efficient: 101% IACS copper conductivity",
      "Low voltage drop — minimal energy loss along the run",
      "Short-circuit protection through superior insulation",
      "Higher dielectric strength via PVC compound",
      "Waterproof and UV resistant",
      "Halogen-free (EN 50525-1 Annex B)",
      "Low smoke emission (EN 61034-2, light transmittance >70%)",
      "Designed service life: 30 years",
      "Rated DC Voltage: 1.5 kV DC · Max permitted 1.8 kV DC",
      "Cross-sections: 4 mm² / 6 mm²",
      "Colours: White, Red, Black",
      "TUV Certified · EN 50618 / IEC 62930 tested",
    ],
    whyChoose:
      "Standard non-solar cables degrade rapidly under UV exposure and high temperatures. Microtek solar cables are explicitly engineered for outdoor PV duty — the difference between a 5-year and 30-year cable lifetime in real installations. The 101% IACS conductivity saves measurable energy across the system lifetime.",
    specs: [
      { label: "Voltage",       value: "1.5 kV DC" },
      { label: "Cross-section", value: "4 / 6 mm²" },
      { label: "Conductivity",  value: "101% IACS" },
      { label: "Temperature",   value: "-40 to +90 °C" },
      { label: "Service life",  value: "30 years" },
      { label: "Standard",      value: "EN 50618 / IEC 62930" },
    ],
    specGroups: [
      {
        title: "Electrical",
        rows: [
          { label: "Rated DC Voltage",          value: "1.5 kV DC" },
          { label: "Max Permitted DC Voltage",  value: "1.8 kV DC" },
          { label: "Max Permitted AC Voltage",  value: "1 kV AC" },
          { label: "Spark Test",                value: "6000 V AC (8400 V DC)" },
          { label: "Voltage Withstand",         value: "6.5 kV AC · 15 kV DC" },
          { label: "Cross-Section Options",     value: "4 mm² · 6 mm²" },
          { label: "Colours Available",         value: "White · Red · Black" },
        ],
      },
      {
        title: "Design & Construction",
        rows: [
          { label: "Conductor",        value: "Flexible Electrolytic Tinned Fine Copper — IEC 60228 Class 5" },
          { label: "Conductivity",     value: "101% IACS — exceeds international standard" },
          { label: "Insulation",       value: "Crosslinked Halogen-Free & Flame-Retardant (XLHF)" },
          { label: "Outer Sheath",     value: "XLHF UV/Ozone-Resistant" },
          { label: "Testing Standard", value: "EN 50618 / IEC 62930 · TUV Certified" },
        ],
      },
      {
        title: "Thermal & Mechanical",
        rows: [
          { label: "Ambient Temperature Range", value: "-40 °C to +90 °C" },
          { label: "Max Conductor Temperature", value: "+120 °C (for 20,000 hours)" },
          { label: "Short Circuit Temperature", value: "+200 °C at conductor (max 5 seconds)" },
          { label: "Mineral Oil Resistance",    value: "Per EN 60811-2-1" },
          { label: "Ozone Resistance",          value: "Per EN 50396 Part 8.1.3 Method B" },
          { label: "Acid & Alkaline Resistance", value: "Per EN 60811-2-1" },
          { label: "Minimum Bending Radius",    value: "6× OD (fixed) · 15× OD (occasional flexing)" },
          { label: "Tensile Strength",          value: "6.5 N/mm² insulation · 8 N/mm² sheath" },
          { label: "Designed Service Life",     value: "30 years under normal usage" },
          { label: "Drum Lengths",              value: "Standard drums · Cut lengths available" },
        ],
      },
    ],
    applications: [
      "PV string wiring",
      "Array DC bus wiring",
      "Inverter DC input cabling",
      "Outdoor rooftop and ground-mount installations",
      "Long-life solar EPC projects",
    ],
    certifications: [
      "TUV Certified",
      "EN 50618 · IEC 62930",
      "EN 50525-1 Annex B (Halogen-free)",
      "EN 61034-2 (Low smoke emission)",
    ],
    warranty: [
      { label: "Designed Service Life", value: "30 Years" },
    ],
    downloads: [
      { label: "Microtek Solar Cable Datasheet (PDF)", type: "datasheet" },
      { label: "TUV Certificate (PDF)",                type: "certificate" },
    ],
    faqs: [
      { q: "Why pay more for solar cable vs standard cable?", a: "Standard cables degrade in 2–5 years under UV exposure. Solar cables maintain insulation integrity for 25+ years — making them dramatically cheaper over the project lifetime." },
      { q: "When to use 4 mm² vs 6 mm²?", a: "4 mm² is suitable for typical residential string runs up to ~25 m. 6 mm² is used for longer runs and higher-current strings to keep voltage drop under 2%." },
    ],
    tags: ["DC Cable", "4mm²", "6mm²", "1500V DC", "TUV", "UV Resistant", "30-Year Life"],
    seo: {
      title: "Microtek Solar DC Cable 4/6 mm² · 1500V DC · TUV Certified | CSGPL",
      description:
        "Microtek solar DC cable 4 mm² / 6 mm² for PV string wiring. 101% IACS copper, XLHF insulation, UV/ozone resistant, EN 50618 / IEC 62930 certified, 30-yr service life.",
    },
  },

  /* ============ F.4 — EARTHING SYSTEM ============ */
  {
    id: "earthing-bonding-system",
    slug: "solar-earthing-bonding-system",
    categorySlug: "solar-bos",
    brand: "CSGPL Engineered",
    brandSlug: "csgpl",
    title: "Earthing & Bonding System",
    subtitle: "IS 3043 Compliant",
    technology: "GI / Copper Earthing for Solar PV Installations",
    shortDescription:
      "GI and copper earthing strips, maintenance-free chemical earth electrodes and module bonding clamps per IS 3043 and CEA Technical Standards. Mandatory safety infrastructure for grid-connected solar.",
    longDescription:
      "A properly designed earthing and bonding system is a mandatory safety requirement for all grid-connected solar installations under the CEA Regulations and IS 3043. We supply GI and copper earthing strips, maintenance-free chemical earth electrodes (MFCE) and module-to-structure bonding clamps as part of the BOS package — engineered per project soil resistivity and load specifications.",
    image: "https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "GI or Copper earthing strips (project-specific)",
      "Tin-plated copper / SS module bonding clamps",
      "Maintenance-free chemical earth electrodes (MFCE)",
      "IS 3043 compliant design",
      "CEA Technical Standards Regulations compliant",
      "IEC 60364 system voltage compliance",
      "Project-specific earth resistance design",
    ],
    whyChoose:
      "Earthing is the single most undervalued element of a solar installation — yet it's the line of defence against fire, equipment failure and personnel safety. We engineer earthing per project soil resistivity and load specifications, not as an afterthought.",
    specs: [
      { label: "Strip material", value: "GI / Copper" },
      { label: "Bonding",        value: "Tin-plated Cu" },
      { label: "Earth pit",      value: "MFCE (preferred)" },
      { label: "Standard",       value: "IS 3043" },
      { label: "Compliance",     value: "CEA / IEC 60364" },
      { label: "Design",         value: "Project-specific" },
    ],
    specGroups: [
      {
        title: "Materials & Standards",
        rows: [
          { label: "Earthing Strip Material",   value: "GI (Galvanised Iron) or Copper — project-specific" },
          { label: "Module Bonding",            value: "Tin-plated copper or SS bonding clamps per module frame" },
          { label: "Earth Pit Type",            value: "Maintenance-free chemical earth electrode (MFCE) — preferred" },
          { label: "Design Standard",           value: "IS 3043" },
          { label: "Regulatory Compliance",     value: "CEA (Technical Standards) Regulations" },
          { label: "System Voltage Compliance", value: "Per IEC 60364 and relevant CEA regulation" },
        ],
      },
    ],
    applications: [
      "All grid-connected solar installations (mandatory)",
      "Industrial solar where lightning protection is critical",
      "Coastal installations requiring corrosion-resistant copper",
      "Standalone/off-grid systems for personnel safety",
    ],
    certifications: [
      "IS 3043 · CEA Technical Standards · IEC 60364",
    ],
    warranty: [
      { label: "Workmanship", value: "1 Year — installation only" },
    ],
    downloads: [
      { label: "Earthing Design Guide (PDF)", type: "guide" },
    ],
    faqs: [
      { q: "Is earthing really required for a residential solar system?", a: "Yes — earthing is mandatory under CEA Regulations for all grid-connected installations, regardless of size. It's the primary safety system against fault currents and lightning." },
    ],
    tags: ["Earthing", "Grounding", "IS 3043", "MFCE", "GI", "Copper", "CEA"],
    seo: {
      title: "Solar Earthing & Bonding System · IS 3043 Compliant | CSGPL",
      description:
        "GI/Copper earthing strips, MFCE earth electrodes and module bonding for solar installations. IS 3043 / CEA / IEC 60364 compliant. Project-specific design.",
    },
  },

  /* ============ G — ACCESSORIES ============ */
  {
    id: "mc4-solar-connectors",
    slug: "mc4-solar-connectors-ip67-ip68",
    categorySlug: "accessories",
    brand: "Industry Standard",
    brandSlug: "standard",
    title: "MC4 PV Connectors",
    subtitle: "IP67 / IP68 · 4–6 mm² Compatible",
    technology: "Weatherproof Solar PV Connectors · IEC 62852",
    shortDescription:
      "IP67/IP68-rated weatherproof DC connectors for module string interconnection. Compatible with 4 mm² and 6 mm² solar cables. Secure locking, low contact resistance, IEC 62852 certified.",
    longDescription:
      "MC4 connectors provide secure, low-loss DC interconnection between solar modules and into the string combiner. Engineered for permanent outdoor operation with IP67/IP68 sealing, UV-stable polymer housing and gold-plated contacts that ensure long-term low contact resistance.",
    image: "https://images.pexels.com/photos/9799702/pexels-photo-9799702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    highlights: [
      "IP67 / IP68 weatherproof rating",
      "Compatible with 4 mm² and 6 mm² solar cables",
      "Secure locking mechanism",
      "Low contact resistance",
      "UV-stable polymer housing",
      "Outdoor weatherproof performance",
      "High-voltage DC system compatible",
      "IEC 62852 certified",
    ],
    whyChoose:
      "Standardised MC4 design simplifies installation and maintenance across all module brands. The locking mechanism prevents accidental disconnection while the IP67/IP68 seal ensures long-term reliability in harsh outdoor environments.",
    specs: [
      { label: "Protection",  value: "IP67 / IP68" },
      { label: "Cable",       value: "4–6 mm²" },
      { label: "Voltage",     value: "1500 V DC" },
      { label: "Connection",  value: "Locking" },
      { label: "UV resistant",value: "Yes" },
      { label: "Standard",    value: "IEC 62852" },
    ],
    specGroups: [
      {
        title: "Specifications",
        rows: [
          { label: "Protection Rating",   value: "IP67 / IP68" },
          { label: "Cable Compatibility", value: "4 mm² · 6 mm²" },
          { label: "Application",         value: "Solar DC Connections" },
          { label: "UV Resistance",       value: "Yes" },
          { label: "Outdoor Rated",       value: "Yes" },
          { label: "Connection Type",     value: "Locking Connector" },
          { label: "Standard",            value: "IEC 62852" },
        ],
      },
    ],
    applications: [
      "Module-to-module string interconnection",
      "String to combiner / DCDB connection",
      "All residential, commercial & industrial PV installations",
      "DC cable terminations",
      "Outdoor PV wiring systems",
    ],
    certifications: [
      "IEC 62852",
      "IP67 / IP68",
    ],
    warranty: [
      { label: "Workmanship", value: "Installation warranty" },
    ],
    downloads: [
      { label: "MC4 Installation Guide (PDF)", type: "guide" },
    ],
    faqs: [
      { q: "Can I crimp MC4 connectors myself?", a: "Crimping requires the correct MC4-compatible crimping tool to achieve a reliable connection. We recommend installation by trained technicians — a bad crimp is a common cause of long-term system underperformance." },
    ],
    tags: ["MC4", "IP67", "IP68", "Connector", "1500V DC", "UV", "Locking"],
    seo: {
      title: "MC4 Solar PV Connectors IP67/IP68 · Weatherproof | CSGPL",
      description:
        "IP67/IP68 UV-resistant MC4 solar connectors for secure DC cable termination. Locking design, low contact resistance, IEC 62852 certified, 4–6 mm² compatible.",
    },
  },
];

/* ============================================================
   ADDITIONAL ACCESSORY ENTRIES (compact catalog for the grid)
   ============================================================ */
export interface AccessoryItem {
  name: string;
  description: string;
  standard: string;
  icon?: LucideIcon;
}

export const accessoryCatalog: AccessoryItem[] = [
  {
    name: "MC4 PV Connectors",
    description: "IP67/IP68-rated weatherproof DC connectors for module string interconnection. Compatible with 4 mm² and 6 mm² solar cable.",
    standard: "IEC 62852 · IP67/IP68",
  },
  {
    name: "PV Junction Boxes",
    description: "IP65/IP67 plastic or metal enclosures for string consolidation at the combiner level. With or without bypass diodes. DIN rail optional.",
    standard: "IP65 / IP67",
  },
  {
    name: "Cable Trays & Conduits",
    description: "UV-resistant PVC or FRP cable management trays and conduits for indoor/outdoor cable routing. Prevents mechanical damage and UV degradation.",
    standard: "UV-resistant to IEC 60614",
  },
  {
    name: "Cable Ties",
    description: "UV-stabilised nylon cable ties rated for outdoor use. Bundle management and secure routing of DC/AC cables along racking and structures.",
    standard: "UV-stabilised nylon",
  },
  {
    name: "Compression Lugs",
    description: "Copper or aluminium compression lugs for secure, low-resistance cable termination at ACDB, inverter and earthing terminals. Sized per conductor.",
    standard: "IS / DIN standards",
  },
  {
    name: "Roof Hooks & L-Feet",
    description: "Hot-dip galvanised or stainless steel roof hooks, L-feet and anchors for attaching mounting rail to RCC, tin, trapezoidal or standing seam roofs.",
    standard: "HDG or SS 304/316",
  },
  {
    name: "Sealing Compound",
    description: "PU and silicone sealants for weatherproofing cable gland entries, roof penetrations and junction box cable entries. UV-stable.",
    standard: "UV-stable PU / Silicone",
  },
  {
    name: "Solar Hazard Labels",
    description: "Arc flash, DC voltage warning, emergency shutdown and isolation point labels per CEA Solar Installation Standards. Printed on UV-resistant vinyl.",
    standard: "CEA / IEC 62548",
  },
  {
    name: "Module Cleaning Kit",
    description: "Brush, microfibre cloth and spray nozzle set for module surface maintenance. Soft bristle brush rated for AR-coated glass.",
    standard: "For AR-coated glass surfaces",
  },
];

/* ============================================================
   Lookup helpers
   ============================================================ */
export const getProductBySlug = (slug: string) =>
  featuredProducts.find((p) => p.slug === slug);

export const getProductsByCategory = (categorySlug: string) =>
  featuredProducts.filter((p) => p.categorySlug === categorySlug);

/** Unique brands in a category — used by Solar Panels brand-tab filter. */
export const getBrandsForCategory = (categorySlug: string): { slug: string; name: string }[] => {
  const seen = new Map<string, string>();
  for (const p of featuredProducts) {
    if (p.categorySlug !== categorySlug || !p.brandSlug) continue;
    if (!seen.has(p.brandSlug)) seen.set(p.brandSlug, p.brand);
  }
  return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
};

/* ============================================================
   "WHY CHOOSE OUR PORTFOLIO" — value props
   ============================================================ */
export interface ValueProp { icon: LucideIcon; title: string; desc: string }

export const portfolioValueProps: ValueProp[] = [
  {
    icon: Award,
    title: "Premium Solar Technology",
    desc: "Modern, high-efficiency solar technologies built for long-term performance and maximum energy yield.",
  },
  {
    icon: Shield,
    title: "Trusted Brands",
    desc: "Portfolio of reliable Indian and global-standard manufacturers with proven market performance.",
  },
  {
    icon: Layers,
    title: "EPC-Focused Selection",
    desc: "Every product selected for real-world project compatibility, installation reliability and long operational life.",
  },
  {
    icon: Plug,
    title: "Residential to Utility Scale",
    desc: "Solutions for homes, commercial rooftops, industrial facilities, institutions, and utility-scale projects.",
  },
  {
    icon: Leaf,
    title: "Technical Consultation",
    desc: "Engineering and sales teams assist with product selection, compatibility guidance and project-specific recommendations.",
  },
];

export type { LucideIcon };
