/**
 * Seo — head sync helpers.
 *
 * Three exports:
 *   • <Seo docKey="seoHome">           — generic page meta from a CMS singleton
 *   • <ArticleSeo post={…}>            — article-specific meta + Article JSON-LD
 *   • <BreadcrumbSeo items={…}>        — Breadcrumb JSON-LD only
 *
 * All three are restore-on-unmount safe.
 */

import { useEffect } from "react";
import { useCmsDocument, type BlogRecord } from "@/cms";
import type { SiteDocKey } from "@/cms";
import { absoluteUrl } from "@/config/runtime";
import { excerpt as makeExcerpt, toIso } from "@/utils/content";

/* ============================================================
   LOW-LEVEL DOM HELPERS
   ============================================================ */

function upsertMeta(attr: "name" | "property", key: string, content: string): () => void {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("content");
  el.setAttribute("content", content);
  return () => {
    if (created) el?.remove();
    else if (prev !== null) el?.setAttribute("content", prev);
  };
}

function upsertLink(rel: string, href: string): () => void {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  const created = !el;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("href");
  el.setAttribute("href", href);
  return () => {
    if (created) el?.remove();
    else if (prev !== null) el?.setAttribute("href", prev);
  };
}

function upsertJsonLd(id: string, data: object): () => void {
  let el = document.head.querySelector(`script[data-seo="${id}"]`) as HTMLScriptElement | null;
  const created = !el;
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
  return () => { if (created) el?.remove(); };
}

/* ============================================================
   <Seo /> — page-level meta from CMS singleton
   ============================================================ */

export interface SeoProps {
  docKey?: Extract<SiteDocKey, `seo${string}`>;
}

export default function Seo({ docKey = "seoHome" }: SeoProps) {
  const { data } = useCmsDocument(docKey);

  useEffect(() => {
    if (!data) return;
    const restorers: Array<() => void> = [];

    const prevTitle = document.title;
    if (data.title) document.title = data.title;

    if (data.description) {
      restorers.push(upsertMeta("name", "description", data.description));
      restorers.push(upsertMeta("property", "og:description", data.description));
      restorers.push(upsertMeta("name", "twitter:description", data.description));
    }
    if (data.keywords)  restorers.push(upsertMeta("name", "keywords", data.keywords));
    if (data.title) {
      restorers.push(upsertMeta("property", "og:title", data.title));
      restorers.push(upsertMeta("name", "twitter:title", data.title));
    }
    if (data.ogImage) {
      restorers.push(upsertMeta("property", "og:image", data.ogImage));
      restorers.push(upsertMeta("name", "twitter:image", data.ogImage));
    }
    restorers.push(upsertMeta("name", "twitter:card", "summary_large_image"));
    restorers.push(upsertMeta("property", "og:type", "website"));
    if (data.canonical) restorers.push(upsertLink("canonical", data.canonical));

    return () => {
      document.title = prevTitle;
      restorers.forEach((fn) => { try { fn(); } catch { /* noop */ } });
    };
  }, [data]);

  return null;
}

/* ============================================================
   <ArticleSeo /> — blog post specific meta + Article JSON-LD
   ============================================================ */

export function ArticleSeo({ post }: { post: BlogRecord }) {
  useEffect(() => {
    const restorers: Array<() => void> = [];

    const title       = post.seoTitle       || post.title;
    const description = post.seoDescription || post.excerpt || makeExcerpt(post.body || "");
    const ogImage     = post.ogImage        || post.coverImage;
    const canonical   = post.canonical      || absoluteUrl(`/blog/${post.slug}`);
    const published   = toIso(post.publishedAt);

    const prevTitle = document.title;
    document.title = title;

    restorers.push(upsertMeta("name", "description", description));
    restorers.push(upsertMeta("name", "twitter:title", title));
    restorers.push(upsertMeta("name", "twitter:description", description));
    restorers.push(upsertMeta("name", "twitter:card", "summary_large_image"));
    restorers.push(upsertMeta("property", "og:title", title));
    restorers.push(upsertMeta("property", "og:description", description));
    restorers.push(upsertMeta("property", "og:type", "article"));
    restorers.push(upsertMeta("property", "og:url", canonical));
    if (ogImage) {
      restorers.push(upsertMeta("property", "og:image", ogImage));
      restorers.push(upsertMeta("name", "twitter:image", ogImage));
    }
    if (published) {
      restorers.push(upsertMeta("property", "article:published_time", published));
    }
    if (post.author) restorers.push(upsertMeta("property", "article:author", post.author));
    if (Array.isArray(post.tags)) {
      post.tags.forEach((t) => restorers.push(upsertMeta("property", "article:tag", t)));
    }
    restorers.push(upsertLink("canonical", canonical));

    // JSON-LD: Article schema
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      image: ogImage ? [ogImage] : undefined,
      datePublished: published || undefined,
      dateModified: toIso(post.updatedAt) || published || undefined,
      author: { "@type": "Person", name: post.author || "CSGPL Editorial" },
      publisher: {
        "@type": "Organization",
        name: "ChaitanyaSri Greentech Pvt. Ltd.",
        logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
    };
    restorers.push(upsertJsonLd(`article-${post.slug}`, jsonLd));

    return () => {
      document.title = prevTitle;
      restorers.forEach((fn) => { try { fn(); } catch { /* noop */ } });
    };
  }, [post]);

  return null;
}

/* ============================================================
   <BreadcrumbSeo /> — Breadcrumb JSON-LD only (no DOM markup)
   ============================================================ */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSeo({ items, id = "breadcrumbs" }: { items: BreadcrumbItem[]; id?: string }) {
  useEffect(() => {
    if (!items.length) return;
    const restore = upsertJsonLd(id, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.url,
      })),
    });
    return restore;
  }, [items, id]);
  return null;
}
