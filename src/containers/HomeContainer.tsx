/**
 * HomeContainer — orchestrates all CMS reads for the public homepage.
 *
 * Rendering pipeline:
 *   1. Read CMS data (one hook per resource, deduped via cmsCache)
 *   2. Read homepageLayout document → section order + visibility
 *   3. Walk the layout, look each section up in `sectionRegistry`,
 *      wrap in <SectionBoundary> so one bad section can't break others
 *
 * Architectural rule:
 *   Sections never call CMS hooks themselves — they only render props.
 */

import { useMemo } from "react";
import { useCmsCollection, useCmsDocument } from "@/cms";
import type {
  ProjectRecord, TestimonialRecord, FaqRecord,
} from "@/cms";

import Seo from "@/components/Seo";
import SectionBoundary from "@/components/SectionBoundary";
import { sectionRegistry, sectionLabels, type HomePageData } from "./sectionRegistry";

export default function HomeContainer() {
  /* ---------- CMS reads (only what sections actually need) ---------- */
  const heroDoc       = useCmsDocument("hero");
  const layoutDoc     = useCmsDocument("homepageLayout");
  const projectsQ     = useCmsCollection<ProjectRecord>("projects");
  const testimonialsQ = useCmsCollection<TestimonialRecord>("testimonials");
  const faqsQ         = useCmsCollection<FaqRecord>("faqs");

  /* ---------- Aggregated payload ---------- */
  const data = useMemo<HomePageData>(() => ({
    hero:         heroDoc.data,
    projects:     projectsQ.data,
    testimonials: testimonialsQ.data,
    faqs:         faqsQ.data,
  }), [heroDoc.data, projectsQ.data, testimonialsQ.data, faqsQ.data]);

  /* ---------- Ordered, enabled section ids ---------- */
  const orderedIds = useMemo(() => {
    return [...layoutDoc.data.sections]
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order)
      .map((s) => s.id);
  }, [layoutDoc.data.sections]);

  return (
    <>
      <Seo docKey="seoHome" />
      <main>
        {orderedIds.map((id) => {
          const render = sectionRegistry[id];
          if (!render) return null;
          return (
            <SectionBoundary key={id} name={sectionLabels[id] ?? id}>
              {render(data)}
            </SectionBoundary>
          );
        })}
      </main>
    </>
  );
}
