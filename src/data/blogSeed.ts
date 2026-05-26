/**
 * Initial blog + category content.
 * Acts as fallback when Firestore is empty / unavailable so the public
 * /blog route always renders meaningful content.
 */

import type { BlogRecord, CategoryRecord } from "@/cms/collections";

export const CATEGORY_SEEDS: CategoryRecord[] = [
  { id: "seed-cat-0", name: "Subsidy Guides", slug: "subsidy-guides", color: "brand", description: "Latest PM Surya Ghar & state-level subsidy explainers." },
  { id: "seed-cat-1", name: "Solar 101",      slug: "solar-101",      color: "amber", description: "Beginner-friendly intros to rooftop solar technology." },
  { id: "seed-cat-2", name: "Case Studies",   slug: "case-studies",   color: "brand", description: "Real CSGPL projects, real numbers." },
];

export const BLOG_SEEDS: BlogRecord[] = [
  {
    id:           "seed-blog-0",
    title:        "PM Surya Ghar Subsidy: A Practical Guide for 2026",
    slug:         "pm-surya-ghar-subsidy-2026",
    author:       "CSGPL Editorial",
    status:       "published",
    featured:     true,
    publishedAt:  "2026-01-12T09:00:00.000Z",
    categorySlug: "subsidy-guides",
    tags:         ["subsidy", "residential", "PM Surya Ghar"],
    coverImage:   "https://images.pexels.com/photos/12243093/pexels-photo-12243093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1200",
    excerpt:      "Everything Indian homeowners need to know about the Central Financial Assistance scheme — eligibility, slabs & how CSGPL handles the paperwork end-to-end.",
    body: `# PM Surya Ghar Subsidy: A Practical Guide for 2026

The **PM Surya Ghar: Muft Bijli Yojana** is the largest residential solar incentive India has ever launched. If you own a rooftop and pay an electricity bill, this is the most generous moment to switch.

## How much can you actually save?

The Central Financial Assistance (CFA) scheme provides a direct subsidy linked to system size:

- **1 KW** → ₹30,000 per kW
- **2 KW** → ₹60,000 per kW
- **3 KW & above** → flat ₹78,000 cap

For an average 3 KW residential system priced at ₹1.8 lakhs, the effective out-of-pocket cost drops to **~₹1 lakh** — paid back in 3–5 years.

## What CSGPL handles for you

We've filed hundreds of applications. The process has 6 steps and we handle every one:

1. National Portal registration (your name)
2. DISCOM technical feasibility check
3. System design + BOQ
4. Net metering application
5. Installation + commissioning
6. Subsidy disbursal tracking

> "From application to disbursal, the entire process took 38 days. CSGPL kept us in the loop every step." — *Rajesh K., Lucknow*

## Should you go bigger than 3 KW?

If your monthly bill exceeds ₹3,000 — yes. The subsidy cap is fixed at 3 KW, but **net metering lets you sell excess generation back to the grid** — meaning a 5–8 KW system often pays back faster than a subsidised 3 KW one.

[Get a free site survey →](/#consultation)
`,
  },
  {
    id:           "seed-blog-1",
    title:        "On-Grid vs Off-Grid vs Hybrid: Which Solar System Should You Choose?",
    slug:         "on-grid-vs-off-grid-vs-hybrid",
    author:       "CSGPL Editorial",
    status:       "published",
    publishedAt:  "2025-12-02T09:00:00.000Z",
    categorySlug: "solar-101",
    tags:         ["on-grid", "off-grid", "hybrid"],
    coverImage:   "https://images.pexels.com/photos/17641131/pexels-photo-17641131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1200",
    excerpt:      "The three main rooftop solar architectures — explained for Indian conditions. Picking the right one can save lakhs over 25 years.",
    body: `# On-Grid vs Off-Grid vs Hybrid

Choosing the wrong system architecture is the most expensive mistake a new solar customer makes. Here's how to pick correctly.

## On-Grid (Grid-Tied)

- **Best for**: Homes & businesses with reliable grid supply.
- **Pros**: Cheapest CAPEX, eligible for net metering, lowest maintenance.
- **Cons**: No power during blackouts (anti-islanding protection).

## Off-Grid

- **Best for**: Remote sites, farmhouses, areas with chronic grid failure.
- **Pros**: True energy independence.
- **Cons**: Battery cost dominates the BOQ — typically 1.5–2× the panel cost.

## Hybrid

- **Best for**: Premium homes & SMBs that want backup + savings.
- **Pros**: Best of both worlds; intelligently switches sources.
- **Cons**: Higher upfront cost than on-grid.

| System  | CAPEX (₹/KW)   | Subsidy-Eligible | Backup |
|---------|----------------|-------------------|--------|
| On-Grid | ₹55,000–65,000 | Yes               | No     |
| Off-Grid| ₹95,000–130,000| No                | Yes    |
| Hybrid  | ₹85,000–110,000| Partial           | Yes    |

For most Indian urban homes, **on-grid is the right answer**. Add a small battery later only if power cuts justify it.
`,
  },
  {
    id:           "seed-blog-2",
    title:        "Case Study: 250 KW Industrial Rooftop in Kanpur",
    slug:         "case-study-kanpur-250kw-industrial",
    author:       "CSGPL Editorial",
    status:       "published",
    publishedAt:  "2025-10-18T09:00:00.000Z",
    categorySlug: "case-studies",
    tags:         ["industrial", "case-study"],
    coverImage:   "https://images.pexels.com/photos/15751132/pexels-photo-15751132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1200",
    excerpt:      "How a Kanpur-based manufacturing unit cut its energy bill by ₹28L/year with a 250 KW rooftop plant — and broke even in 3.4 years.",
    body: `# 250 KW Industrial Rooftop · Kanpur

A medium-sized manufacturing unit approached CSGPL with a monthly bill of **₹3.2 lakhs**. Their roof had 22,000 sq.ft of usable surface.

## What we built

- **Capacity**: 250 KW (525 × 480 Wp Mono PERC modules)
- **Inverter**: 5 × 50 KW string inverters with WiFi monitoring
- **Mounting**: Hot-dip galvanized GI rails, 200 km/hr wind load
- **Net metering**: 200 KW bidirectional approved

## The numbers

- **CAPEX**: ₹1.4 Cr (pre-tax)
- **Annual generation**: ~3.4 lakh units/year
- **Annual savings**: **₹28 lakhs**
- **Payback**: **3.4 years**
- **25-year NPV**: ₹4.7 Cr

> "The project came in on time and 4% under budget. The monitoring dashboard means we never have surprise downtime." — *Plant Manager*

This is what a well-engineered industrial solar plant looks like — every kilowatt of capacity backed by a financial model the CFO can trust.
`,
  },
];
