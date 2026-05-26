/**
 * AboutContainer — orchestrates the About page.
 * Each section is pure presentation; this is the only place that decides order.
 */

import Seo from "@/components/Seo";
import SectionBoundary from "@/components/SectionBoundary";
import AboutHero from "@/sections/about/AboutHero";
import CompanyStory from "@/sections/about/CompanyStory";
import WhyChooseUs from "@/sections/about/WhyChooseUs";
import ProductsTechnology from "@/sections/about/ProductsTechnology";
import MissionVision from "@/sections/about/MissionVision";
import WorkProcess from "@/sections/about/WorkProcess";
import Leadership from "@/sections/about/Leadership";
import Achievements from "@/sections/about/Achievements";
import TrustBand from "@/sections/about/TrustBand";
import AboutFinalCta from "@/sections/about/AboutFinalCta";

const SECTIONS: { name: string; render: () => React.ReactNode }[] = [
  { name: "AboutHero",          render: () => <AboutHero /> },
  { name: "CompanyStory",       render: () => <CompanyStory /> },
  { name: "WhyChooseUs",        render: () => <WhyChooseUs /> },
  { name: "ProductsTechnology", render: () => <ProductsTechnology /> },
  { name: "MissionVision",      render: () => <MissionVision /> },
  { name: "WorkProcess",        render: () => <WorkProcess /> },
  { name: "Leadership",         render: () => <Leadership /> },
  { name: "Achievements",       render: () => <Achievements /> },
  { name: "TrustBand",          render: () => <TrustBand /> },
  { name: "AboutFinalCta",      render: () => <AboutFinalCta /> },
];

export default function AboutContainer() {
  return (
    <>
      <Seo docKey="seoAbout" />
      <main>
        {SECTIONS.map((s) => (
          <SectionBoundary key={s.name} name={s.name}>
            {s.render()}
          </SectionBoundary>
        ))}
      </main>
    </>
  );
}
