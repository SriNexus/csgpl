/**
 * DynamicPageContainer — renders a CMS `pages/<slug>` document.
 *
 * Route: /p/:slug
 *   • finds the page in the `pages` collection
 *   • iterates `page.sections[]` and renders each via `pageBlockRegistry`
 *   • each block wrapped in <SectionBoundary> for isolation
 */

import { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCmsCollection, type PageRecord } from "@/cms";
import Seo from "@/components/Seo";
import SectionBoundary from "@/components/SectionBoundary";
import { pageBlockRegistry } from "./pageBlockRegistry";

export default function DynamicPageContainer() {
  const { slug = "" } = useParams<{ slug: string }>();
  const pages = useCmsCollection<PageRecord>("pages");

  const page = useMemo(
    () => pages.data.find((p) => p.slug === slug && p.status === "published"),
    [pages.data, slug]
  );

  if (!page && !pages.loading) return <Navigate to="/" replace />;
  if (!page) return null;

  return (
    <>
      <PageMeta page={page} />
      <main>
        {page.sections.map((block) => {
          const render = pageBlockRegistry[block.kind];
          if (!render) return null;
          return (
            <SectionBoundary key={block.id} name={`${page.slug}/${block.kind}`}>
              {render(block)}
            </SectionBoundary>
          );
        })}
      </main>
    </>
  );
}

/* Inline SEO that overrides the generic Seo doc when the page declares overrides. */
function PageMeta({ page }: { page: PageRecord }) {
  // Use seoHome as a generic baseline; overrides applied imperatively below.
  // (Avoid creating a per-page SEO doc — that would be admin friction.)
  return (
    <>
      <Seo docKey="seoHome" />
      <PageMetaOverrides page={page} />
    </>
  );
}

function PageMetaOverrides({ page }: { page: PageRecord }) {
  // Lightweight inline patcher (mirrors <Seo>'s approach) so overrides take effect
  // *after* the generic Seo mounts.
  useTitleAndMeta(
    page.seoTitle || page.title,
    page.seoDescription,
    page.ogImage,
    page.canonical,
  );
  return null;
}

import { useEffect } from "react";

function useTitleAndMeta(title: string, description?: string, ogImage?: string, canonical?: string) {
  useEffect(() => {
    const restorers: Array<() => void> = [];
    const prevTitle = document.title;
    if (title) document.title = title;

    function ensureMeta(attr: "name" | "property", key: string, content: string) {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      const created = !el;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      restorers.push(() => { if (created) el?.remove(); else if (prev !== null) el?.setAttribute("content", prev); });
    }
    function ensureLink(rel: string, href: string) {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      const created = !el;
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      const prev = el.getAttribute("href");
      el.setAttribute("href", href);
      restorers.push(() => { if (created) el?.remove(); else if (prev !== null) el?.setAttribute("href", prev); });
    }

    if (description) ensureMeta("name", "description", description);
    if (description) ensureMeta("property", "og:description", description);
    if (title)       ensureMeta("property", "og:title", title);
    if (ogImage)     ensureMeta("property", "og:image", ogImage);
    if (canonical)   ensureLink("canonical", canonical);

    return () => { document.title = prevTitle; restorers.forEach((fn) => { try { fn(); } catch { /* noop */ } }); };
  }, [title, description, ogImage, canonical]);
}
