import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader, Badge, Backdrop, Button, Image } from "@/components/ui";
import { solutions as solutionSeeds } from "@/data/content";
import type { SolutionRecord } from "@/cms";

export interface SolutionsProps {
  /** Live CMS records. Defaults to static seed if not provided. */
  items?: SolutionRecord[];
}

type SolutionLike = { title: string; desc: string; img: string; tag: string };

/**
 * Solutions — bento with 1 featured + 5 compact image cards.
 * Pure presentation; receives data via props.
 */
export default function Solutions({ items }: SolutionsProps) {
  const list: SolutionLike[] = (items && items.length ? items : solutionSeeds) as SolutionLike[];
  if (!list.length) return null;
  const [featured, ...rest] = list;

  return (
    <Section
      id="solutions"
      tone="paper"
      backdrop={
        <>
          <Backdrop preset="paper-dots" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ink-900/10 to-transparent" />
        </>
      }
    >
      <SectionHeader
        eyebrow="Solar Solutions"
        title={
          <>
            End-to-end solar EPC <br />
            <span className="serif font-normal text-ink-600">for</span>{" "}
            <span className="text-gradient-brand">every kind of roof.</span>
          </>
        }
        description="From compact 3 KW homes to 500 KW industrial plants — every CSGPL project is engineered, executed and monitored by a single accountable team."
        aside={
          <Button as="a" href="#consultation" variant="link" className="mt-5">
            Explore all solutions <ArrowUpRight className="h-4 w-4" />
          </Button>
        }
      />

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-5 lg:gap-6">
        <FeaturedCard s={featured} />
        {rest.map((s) => <SolutionRow key={s.title} s={s} />)}
      </div>
    </Section>
  );
}

function FeaturedCard({ s }: { s: SolutionLike }) {
  return (
    <article className="group lg:col-span-7 lg:row-span-2 relative card-hover rounded-[1.75rem] overflow-hidden bg-white border hairline shadow-soft">
      <div className="relative h-[440px] lg:h-full img-cinematic">
        <Image src={s.img} alt={s.title} fallback="residential" className="h-full w-full object-cover img-zoom img-duotone" />
      </div>
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <Badge tone="amber" variant="loud">★ Featured</Badge>
        <Badge tone="white" variant="loud" className="text-brand-700">{s.tag}</Badge>
      </div>
      <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8 text-white">
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{s.title}</h3>
        <p className="mt-3 text-white/85 max-w-md text-[15px] leading-relaxed">{s.desc}</p>
        <div className="mt-6 flex items-center gap-4">
          <Button as="a" href="#consultation" variant="white" size="lg" trailingArrow>
            Explore Solution
          </Button>
          <div className="hidden sm:block text-xs text-white/60">
            <div className="font-semibold text-white/80">From ₹65,000 / KW</div>
            <div>Subsidy-eligible</div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SolutionRow({ s }: { s: SolutionLike }) {
  return (
    <article className="group lg:col-span-5 relative card-hover rounded-[1.5rem] overflow-hidden bg-white border hairline shadow-soft">
      <div className="grid grid-cols-5">
        <div className="col-span-2 relative img-cinematic">
          <Image src={s.img} alt={s.title} fallback="commercial" className="h-full w-full object-cover img-zoom" />
        </div>
        <div className="col-span-3 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">{s.tag}</div>
            <h3 className="mt-2 text-lg font-bold text-ink-900 tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-ink-600 leading-relaxed">{s.desc}</p>
          </div>
          <a href="#consultation" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-900 arrow-link">
            Learn more <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
