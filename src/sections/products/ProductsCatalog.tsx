/**
 * ProductsCatalog — Products landing page.
 *
 * Per the brief: "Category grid with 5 tiles: Solar Panels | Inverters |
 * Batteries | Solar BOS | Accessories. Icon-based navigation with hover
 * descriptions."
 *
 * Plus an extended editorial "featured products" preview underneath.
 */

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader, Backdrop, Card } from "@/components/ui";
import { productCategories, getProductsByCategory } from "@/data/productsCatalog";
import ProductCard from "./ProductCard";

export default function ProductsCatalog() {
  return (
    <>
      {/* 5-tile category grid */}
      <Section id="catalog" tone="white" padding="lg" backdrop={<Backdrop preset="soft-fade" />}>
        <SectionHeader
          eyebrow="Browse by Category"
          eyebrowTone="amber"
          title={
            <>
              <span className="serif font-normal text-ink-600">Five product</span>{" "}
              <span className="text-gradient-brand">categories.</span>
            </>
          }
          description="Click any tile to explore the full product range, filter by brand, phase or type — and access detailed specifications for each model."
        />

        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {productCategories.map((cat) => {
            const Icon = cat.icon;
            const itemCount = getProductsByCategory(cat.slug).length;
            return (
              <li key={cat.slug}>
                <Link to={`/products/${cat.slug}`} className="block group h-full">
                  <Card interactive padding="lg" className="h-full flex flex-col">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.accent.from} ${cat.accent.to} text-white grid place-items-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold text-ink-900 tracking-tight">{cat.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] font-bold text-brand-700">{cat.tagline}</p>
                    <p className="mt-3 text-sm text-ink-600 leading-relaxed flex-1">{cat.description.split(".")[0]}.</p>
                    <div className="mt-5 pt-4 border-t hairline flex items-center justify-between">
                      <span className="text-[11px] font-bold text-ink-500">
                        {itemCount} {itemCount === 1 ? "product" : "products"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 group-hover:gap-2 transition-all">
                        Browse <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Featured editorial preview — top picks across all categories */}
      <Section tone="paper" padding="lg">
        <SectionHeader
          eyebrow="Featured Products"
          title={
            <>
              <span className="serif font-normal text-ink-600">Hand-picked</span>{" "}
              <span className="text-gradient-brand">across every category.</span>
            </>
          }
          description="A curated cross-section of our premium portfolio — explore the full catalog inside each category page."
        />

        <div className="mt-12 space-y-12">
          {productCategories.map((cat) => {
            const items = getProductsByCategory(cat.slug);
            if (items.length === 0) return null;
            const [featured, ...rest] = items;
            const Icon = cat.icon;
            return (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-28">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-6 border-b hairline">
                  <div className="flex items-start gap-4">
                    <span className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cat.accent.from} ${cat.accent.to} text-white grid place-items-center shadow-md shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900">{cat.name}</h2>
                      <p className="mt-1 text-sm text-ink-600 max-w-xl">{cat.description}</p>
                    </div>
                  </div>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="text-sm font-bold text-brand-700 hover:text-brand-800 arrow-link inline-flex items-center gap-1.5 self-start sm:self-end"
                  >
                    Explore {cat.shortName} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {featured && <ProductCard product={featured} featured />}
                  {rest.length > 0 && (
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                      {rest.slice(0, 2).map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  )}
                </div>

                {rest.length > 2 && (
                  <div className="mt-4 text-right">
                    <Link
                      to={`/products/${cat.slug}`}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      + {rest.length - 2} more in {cat.name} →
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
