/**
 * ProductsHero — premium hero for the /products landing page.
 * Pure presentation.
 */

import { Sparkles } from "lucide-react";
import { Section, Backdrop, Heading, Lead, Button } from "@/components/ui";
import { productCategories } from "@/data/productsCatalog";

export default function ProductsHero() {
  return (
    <Section
      tone="paper"
      padding="xl"
      className="pt-32 md:pt-40"
      backdrop={<Backdrop preset="aurora-light" />}
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center animate-fade-up">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 pl-1.5 pr-4 py-1 text-xs font-semibold text-brand-800 shadow-soft">
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center text-white">
              <Sparkles className="h-3 w-3" />
            </span>
            Premium Solar Products
          </div>

          <Heading size="display" className="mt-7">
            High-performance solar <br />
            <span className="serif font-normal text-ink-600">solutions for</span>{" "}
            <span className="text-gradient-brand">every project.</span>
          </Heading>

          <Lead className="mt-7 text-[1.05rem] sm:text-[1.125rem]">
            A curated portfolio of premium solar products engineered for long-term reliability,
            high energy yield and superior project performance — from N-Type TOPCon panels to
            intelligent hybrid inverters, lithium storage, mounting systems and accessories.
          </Lead>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="a" href="#catalog" size="lg" trailingArrow>Browse catalog</Button>
            <Button as="a" href="/#consultation" variant="ghost" size="lg">Talk to an expert</Button>
          </div>
        </div>

        {/* Category strip */}
        <div className="lg:col-span-5">
          <div className="rounded-[1.75rem] bg-white/70 backdrop-blur border hairline shadow-premium p-5 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-500 mb-3">
              5 product categories
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {productCategories.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.slug}>
                    <a
                      href={`/products/${c.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper transition-colors group"
                    >
                      <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${c.accent.from} ${c.accent.to} text-white grid place-items-center shadow-sm`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-ink-900 truncate">{c.name}</span>
                        <span className="block text-[11px] text-ink-500 truncate">{c.tagline}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
