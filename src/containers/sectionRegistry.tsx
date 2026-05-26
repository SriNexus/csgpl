/**
 * sectionRegistry — declarative mapping of HomeSectionId → renderer.
 *
 * The HomeContainer hydrates a single `HomePageData` payload from CMS,
 * then walks the layout (ordered + filtered) and asks the registry to
 * render each section.
 */

import type {
  HomeSectionId,
  ProjectRecord, TestimonialRecord, FaqRecord,
} from "@/cms";
import type { heroContent } from "@/data/content";

import Hero from "@/sections/Hero";
import StatsBand from "@/sections/StatsBand";
import Services from "@/sections/Services";
import WhyGoSolar from "@/sections/WhyGoSolar";
import Products from "@/sections/Products";
import RoiSavings from "@/sections/RoiSavings";
import Process from "@/sections/Process";
import Projects from "@/sections/Projects";
import Testimonials from "@/sections/Testimonials";
import ConsultationForm from "@/sections/ConsultationForm";
import FAQ from "@/sections/FAQ";
import FinalCta from "@/sections/FinalCta";

/** Aggregate payload passed by HomeContainer into the registry. */
export interface HomePageData {
  hero:         typeof heroContent;
  projects:     ProjectRecord[];
  testimonials: TestimonialRecord[];
  faqs:         FaqRecord[];
}

/** Each section returns React.ReactNode. Order is decided by HomeContainer. */
export const sectionRegistry: Record<HomeSectionId, (d: HomePageData) => React.ReactNode> = {
  hero:         (d) => <Hero          content={d.hero} />,
  statsBand:    ()  => <StatsBand />,
  services:     ()  => <Services />,
  whyGoSolar:   ()  => <WhyGoSolar />,
  products:     ()  => <Products />,
  roiSavings:   ()  => <RoiSavings />,
  process:      ()  => <Process />,
  projects:     (d) => <Projects      items={d.projects} />,
  testimonials: (d) => <Testimonials  items={d.testimonials} />,
  faq:          (d) => <FAQ           items={d.faqs} />,
  consultation: ()  => <ConsultationForm />,
  finalCta:     ()  => <FinalCta />,
};

/** Friendly labels used by the admin Page Builder. */
export const sectionLabels: Record<HomeSectionId, string> = {
  hero:         "Hero",
  statsBand:    "Stats Band",
  services:     "Services (EPC)",
  whyGoSolar:   "Why Go Solar",
  products:     "Products Showcase",
  roiSavings:   "ROI & Savings",
  process:      "How It Works",
  projects:     "Project Showcase",
  testimonials: "Testimonials",
  faq:          "FAQ",
  consultation: "Consultation Form",
  finalCta:     "Final CTA",
};
