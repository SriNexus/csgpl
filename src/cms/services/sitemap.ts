/**
 * sitemap — runtime-callable generators for sitemap.xml & robots.txt.
 *
 * Pulls live data from cmsService so it always reflects the current
 * Firestore state. Designed to be called from the admin UI which
 * downloads the result as a file — or by a build-time script when one
 * is added later.
 */

import { absoluteUrl } from "@/config/runtime";
import { cmsService } from "./cmsService";
import { toIso } from "@/utils/content";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/** Static public routes that always exist. */
const STATIC_ROUTES: SitemapEntry[] = [
  { loc: absoluteUrl("/"),               changefreq: "weekly",  priority: 1.0 },
  { loc: absoluteUrl("/about"),          changefreq: "monthly", priority: 0.7 },
  { loc: absoluteUrl("/products"),       changefreq: "monthly", priority: 0.8 },
  { loc: absoluteUrl("/solar-for-need"), changefreq: "monthly", priority: 0.7 },
  { loc: absoluteUrl("/blog"),           changefreq: "weekly",  priority: 0.9 },
  { loc: absoluteUrl("/contact"),        changefreq: "monthly", priority: 0.6 },
];

async function dynamicEntries(): Promise<SitemapEntry[]> {
  const [blogs, pages] = await Promise.all([
    cmsService.list("blogs"),
    cmsService.list("pages"),
  ]);

  const entries: SitemapEntry[] = [];

  for (const post of blogs.data) {
    if (post.status !== "published") continue;
    entries.push({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: toIso(post.updatedAt || post.publishedAt),
      changefreq: "monthly",
      priority: 0.7,
    });
  }
  for (const page of pages.data) {
    if (page.status !== "published") continue;
    entries.push({
      loc: absoluteUrl(`/p/${page.slug}`),
      lastmod: toIso(page.updatedAt || page.publishedAt),
      changefreq: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;"
  );
}

function renderEntry(e: SitemapEntry): string {
  const parts: string[] = [`<url><loc>${xmlEscape(e.loc)}</loc>`];
  if (e.lastmod)    parts.push(`<lastmod>${e.lastmod}</lastmod>`);
  if (e.changefreq) parts.push(`<changefreq>${e.changefreq}</changefreq>`);
  if (e.priority != null) parts.push(`<priority>${e.priority.toFixed(1)}</priority>`);
  parts.push("</url>");
  return parts.join("");
}

export const sitemap = {
  /** Returns the sitemap.xml string. */
  async buildXml(): Promise<string> {
    const dynamic = await dynamicEntries();
    const all = [...STATIC_ROUTES, ...dynamic];
    const body = all.map(renderEntry).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
  },

  /** Returns the robots.txt string. */
  buildRobots(): string {
    const siteMapUrl = absoluteUrl("/sitemap.xml");
    return [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /admin/",
      "",
      `Sitemap: ${siteMapUrl}`,
      "",
    ].join("\n");
  },
};
