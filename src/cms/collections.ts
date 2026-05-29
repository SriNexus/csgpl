/**
 * CMS collection registry — single source of truth for:
 *   • collection keys
 *   • TypeScript record shapes
 *   • static fallback data (mirrors `src/data/content.ts`)
 *
 * Adding a new collection?
 *   1. Define its `*Record` type
 *   2. Register it in `cmsCollections` with its default seed
 *   3. Consume via `useCmsCollection<MyRecord>("myKey")` anywhere
 */

import type { CmsRecord } from "./types";
import {
  whyFeatures, solutions, products as productSeeds, projects as projectSeeds,
  testimonials as testimonialSeeds, faqs as faqSeeds, processSteps, roiRows,
  heroContent,
} from "@/data/content";
import { site } from "@/data/site";
import { footerLinks } from "@/data/navigation";
import { BLOG_SEEDS, CATEGORY_SEEDS } from "@/data/blogSeed";

/* =========================================================
   Record shapes
   ========================================================= */

export interface ProjectRecord extends CmsRecord {
  title: string;
  loc: string;
  kw: string;
  savings: string;
  co2: string;
  img: string;
  type: string;
}

export interface TestimonialRecord extends CmsRecord {
  name: string;
  role: string;
  system: string;
  text: string;
  rating: number;
}

export interface ProductRecord extends CmsRecord {
  title: string;
  tagline: string;
  specs: string[];
  img: string;
  /** Icon key — admin selects from a fixed registry. */
  iconKey?: string;
  /** Tailwind gradient classes e.g. "from-amber-400 to-orange-500" */
  color?: string;
}

export interface FaqRecord extends CmsRecord {
  q: string;
  a: string;
  order?: number;
}

export interface LeadRecord extends CmsRecord {
  name: string;
  phone: string;
  email: string;
  city: string;
  systemType: string;
  monthlyBill: string;
  source?: string;
  status?: "new" | "contacted" | "won" | "lost";
}

/**
 * Blog post. Markdown-authored; rendered at runtime via `renderMarkdown`.
 * Field names use camelCase (legacy `Title/Slug/...` removed — admin migration
 * happens via the BlogsView editor on first save).
 */
export interface BlogRecord extends CmsRecord {
  title: string;
  slug: string;
  author?: string;
  status: "draft" | "published";
  excerpt?: string;
  body: string;                 // markdown source
  coverImage?: string;          // URL to featured image
  categorySlug?: string;        // FK → CategoryRecord.slug
  tags?: string[];
  featured?: boolean;
  publishedAt?: string;         // ISO
  /* SEO overrides — fall back to title/excerpt if empty */
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonical?: string;
}

/** Category — used by blog posts & dynamic pages. */
export interface CategoryRecord extends CmsRecord {
  name: string;
  slug: string;
  description?: string;
  color?: string;               // accent color (Tailwind class fragment, e.g. "amber" | "brand")
}

/**
 * Dynamic page — fully editable from admin (slug → DynamicPage route).
 * `sections` is an ordered list of blocks rendered by the dynamic section
 * registry (extends the homepage's section registry pattern).
 */
export type PageSectionBlock =
  | { kind: "richText"; id: string; markdown: string }
  | { kind: "hero";     id: string; eyebrow?: string; title: string; description?: string; image?: string }
  | { kind: "image";    id: string; src: string; alt?: string; caption?: string }
  | { kind: "cta";      id: string; title: string; description?: string; buttonLabel: string; buttonHref: string };

export interface PageRecord extends CmsRecord {
  title: string;
  slug: string;
  status: "draft" | "published";
  sections: PageSectionBlock[];
  /* SEO overrides */
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonical?: string;
  publishedAt?: string;
}

/**
 * Media asset record — single source of truth for the Media Library.
 * Stored in Firestore `media/<id>` (primary) + mirrored locally for offline.
 */
export interface MediaRecord extends CmsRecord {
  /** File name (sanitized). */
  name: string;
  /** Public URL — Firebase Storage download URL or data: URL fallback. */
  url: string;
  /** Storage object path (only set when uploaded to Firebase Storage). */
  storagePath?: string;
  /** MIME type AFTER any compression, e.g. "image/png" / "image/svg+xml" / "image/x-icon". */
  contentType: string;
  /** Bytes AFTER compression. */
  size: number;
  /** Optional admin label (defaults to file name). */
  label?: string;
  /** Free-form folder/category, e.g. "logo" | "favicon" | "banner" | "product" | "uploads". */
  folder?: string;

  /* ----- Phase 2B-A metadata ----- */
  /** Image width in px (raster only). */
  width?: number;
  /** Image height in px (raster only). */
  height?: number;
  /** Original byte size before client-side compression. */
  originalSize?: number;
  /** Original MIME type before compression. */
  originalType?: string;
  /** True when the file was rewritten by the in-browser compressor. */
  compressed?: boolean;
  /** SHA-256 hex digest of the uploaded file — used for duplicate detection. */
  hash?: string;
  /** Reference count — incremented when this media is attached to a CMS doc. */
  refCount?: number;
}

export interface SolutionRecord extends CmsRecord {
  title: string;
  desc: string;
  img: string;
  tag: string;
}

export interface ProcessStepRecord extends CmsRecord {
  title: string;
  desc: string;
  meta: string;
  iconKey?: string;
}

/**
 * Hero Slider Slide — premium campaign-style hero carousel.
 * Each slide supports:
 *   • Desktop & mobile images (auto-swap based on viewport)
 *   • Heading, subheading, CTA text/link
 *   • Overlay opacity control
 *   • Active/inactive toggle for disabling slides
 *   • Sort order for carousel sequencing
 */
export interface HeroSlideRecord extends CmsRecord {
  /** Slide heading text — large, bold */
  heading: string;
  /** Slide subheading — supporting text */
  subheading?: string;
  /** Desktop image URL (1920×900 px recommended) */
  desktopImage: string;
  /** Mobile image URL (1080×1350 px recommended) — auto-selected on small viewports */
  mobileImage: string;
  /** CTA button text */
  buttonText?: string;
  /** CTA button target URL */
  buttonUrl?: string;
  /** Overlay darkness (0–1), default 0.3 */
  overlayOpacity?: number;
  /** Slide visibility toggle */
  active?: boolean;
  /** Display order in carousel (lower = earlier) */
  order?: number;
}

/* =========================================================
   Collection registry
   Each entry maps a collection key → typed seed data.
   Seed data powers both:
     • initial fallback render (CMS hook returns it instantly)
     • localStorage hydration if Firestore is unreachable
   ========================================================= */

type CollectionDef<T extends CmsRecord> = {
  key: string;
  /** Static default seed mirrored from `src/data/content.ts`. */
  seed: T[];
};

const idify = <T>(arr: T[], prefix: string): (T & CmsRecord)[] =>
  arr.map((item, i) => ({ ...(item as object), id: `seed-${prefix}-${i}` } as T & CmsRecord));

export const cmsCollections = {
  projects: {
    key: "projects",
    seed: idify(projectSeeds, "projects"),
  } as CollectionDef<ProjectRecord>,

  testimonials: {
    key: "testimonials",
    seed: idify(testimonialSeeds, "testimonials"),
  } as CollectionDef<TestimonialRecord>,

  products: {
    key: "products",
    seed: idify(productSeeds.map((p) => ({
      title: p.title,
      tagline: p.tagline,
      specs: [...p.specs],
      img: p.img,
      color: p.color,
    })), "products"),
  } as CollectionDef<ProductRecord>,

  faqs: {
    key: "faqs",
    seed: idify(faqSeeds, "faqs"),
  } as CollectionDef<FaqRecord>,

  solutions: {
    key: "solutions",
    seed: idify(solutions, "solutions"),
  } as CollectionDef<SolutionRecord>,

  process: {
    key: "process",
    seed: idify(processSteps.map((s) => ({ title: s.title, desc: s.desc, meta: s.meta })), "process"),
  } as CollectionDef<ProcessStepRecord>,

  leads: {
    key: "leads",
    seed: [] as LeadRecord[],
  } as CollectionDef<LeadRecord>,

  blogs: {
    key: "blogs",
    seed: BLOG_SEEDS,
  } as CollectionDef<BlogRecord>,

  categories: {
    key: "categories",
    seed: CATEGORY_SEEDS,
  } as CollectionDef<CategoryRecord>,

  pages: {
    key: "pages",
    seed: [] as PageRecord[],
  } as CollectionDef<PageRecord>,

  media: {
    key: "media",
    seed: [] as MediaRecord[],
  } as CollectionDef<MediaRecord>,

  heroSlides: {
    key: "heroSlides",
    seed: [] as HeroSlideRecord[],
  } as CollectionDef<HeroSlideRecord>,
} as const;

export type CollectionKey = keyof typeof cmsCollections;

/* =========================================================
   Singleton documents (key/value content, not lists)
   ========================================================= */

/* ---- Per-page SEO metadata ---- */
export interface SeoMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
}

/* ---- Global settings ---- */
export interface SettingsDoc {
  brandName: string;
  legalName: string;
  tagline: string;
  email: string;
  phonePrimary: string;
  phonePrimaryRaw: string;
}

/* ---- Footer content ---- */
export interface FooterDoc {
  description: string;
  links: { label: string; href: string }[];
}

/* ---- Branding (logo + favicon, etc.) ---- */
/**
 * Branding schema — single source of truth for every logo / icon surface.
 *
 * The frontend NEVER falls back to inline SVG, base-64 strings or company-name
 * derived placeholders. When a slot is empty, the consuming component shows
 * a neutral skeleton (or hides itself) and the admin is prompted to upload
 * the missing asset.
 */
export interface BrandingDoc {
  /** Primary logo for light backgrounds (Navbar, Sidebar). */
  logoLight?: string;
  /** Dark-background variant (Footer, dark-tone landing pages). */
  logoDark?: string;
  /**
   * Compact "icon-only" version used in collapsed sidebars,
   * the admin shell, and small-viewport navbars.
   */
  logoCollapsed?: string;
  /** Browser tab icon — synced to <link rel="icon"> at runtime. */
  favicon?: string;

  /* Optional secondary slots — preserved for back-compat & ease of growth. */
  appleTouchIcon?: string;
  ogImage?: string;
}

/* ---- Homepage layout (section order + visibility) ---- */
/** Stable section identifiers used by HomeContainer's registry. */
export const HOME_SECTION_IDS = [
  "hero", "statsBand", "services", "whyGoSolar", "products",
  "roiSavings", "process", "projects", "testimonials", "faq",
  "consultation", "finalCta",
] as const;
export type HomeSectionId = typeof HOME_SECTION_IDS[number];

export interface HomeSectionConfig {
  id: HomeSectionId;
  enabled: boolean;
  order: number;
}
export interface HomepageLayoutDoc {
  sections: HomeSectionConfig[];
}

/** Default layout — matches the visual order shipped before Phase 1D. */
export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayoutDoc = {
  sections: HOME_SECTION_IDS.map((id, i) => ({ id, enabled: true, order: i + 1 })),
};

export interface SiteDocs {
  hero:        typeof heroContent;
  whyFeatures: typeof whyFeatures;
  roiRows:     typeof roiRows;

  settings:    SettingsDoc;
  footer:      FooterDoc;
  branding:    BrandingDoc;

  // SEO per page (key suffix is page slug)
  seoHome:     SeoMeta;
  seoAbout:    SeoMeta;
  seoProducts: SeoMeta;
  seoBlog:     SeoMeta;
  seoContact:  SeoMeta;

  /** Section ordering & visibility for the homepage. */
  homepageLayout: HomepageLayoutDoc;
}

/** Default singleton documents — used as `useCmsDocument` seed. */
export const siteDocsSeed: SiteDocs = {
  hero: heroContent,
  whyFeatures,
  roiRows,

  settings: {
    brandName: site.brand.name,
    legalName: site.brand.legalName,
    tagline:   site.brand.tagline,
    email:     site.contact.email,
    phonePrimary:    site.contact.phonePrimary,
    phonePrimaryRaw: site.contact.phonePrimaryRaw,
  },

  footer: {
    description:
      `${site.brand.legalName} — a premium Solar EPC company delivering ` +
      `residential, commercial & industrial solar power solutions across India.`,
    links: [...footerLinks.explore],
  },

  /** Default branding — empty URLs mean "no asset configured yet". */
  branding: {
    logoLight: "",
    logoDark: "",
    logoCollapsed: "",
    favicon: "",
    appleTouchIcon: "",
    ogImage: "",
  },

  seoHome:     mkSeo("Home"),
  seoAbout:    mkSeo("About Us"),
  seoProducts: mkSeo("Products"),
  seoBlog:     mkSeo("Blog"),
  seoContact:  mkSeo("Contact"),

  homepageLayout: DEFAULT_HOMEPAGE_LAYOUT,
};

function mkSeo(label: string): SeoMeta {
  return {
    title:       `CSGPL — ${label} | Solar EPC India`,
    description: `Premium ${label.toLowerCase()} solar solutions by ChaitanyaSri Greentech. Save up to 90% on electricity bills.`,
    keywords:    "solar EPC, rooftop solar, solar panels, India, CSGPL",
  };
}

/** Document keys are flat strings: e.g. `useCmsDocument("hero")` → Firestore doc `pages/home/sections/hero`. */
export type SiteDocKey = keyof SiteDocs;
