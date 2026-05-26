/**
 * Products — homepage product showcase.
 *
 * Premium clean grid (e-commerce feel) showing the 5 featured products.
 * Each card: image · category badge · name · 2–3 specs · CTA arrow.
 * Replaces the previous crowded "dark hero + side rows" layout.
 */

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader, Card, Badge, Image, Button } from "@/components/ui";
import { featuredProducts, getCategoryBySlug } from "@/data/productsCatalog";
import type { FeaturedProduct } from "@/data/productsCatalog";

/** Single curated lineup — one product per category. */
const HOMEPAGE_LINEUP_SLUGS = [
  "emmvee-titanium-duo-530-625wp",
  "feston-engield-on-grid-1.5kw-25kw",
  "feston-vega-lv-lithium-battery-51.2v",
  "gi-solar-mounting-structures",
  "mc4-solar-connectors-ip67-ip68",
];

export default function Products() {
  const lineup = HOMEPAGE_LINEUP_SLUGS
    .map((slug) => featuredProducts.find((p) => p.slug === slug))
    .filter((p): p is FeaturedProduct => !!p);

  return (
    <Section id="products" tone="paper" padding="lg">
      <SectionHeader
        eyebrow="Premium Products"
        eyebrowTone="amber"
        title={
          <>
            <span className="serif font-normal text-ink-600">Tier-1 components</span>{" "}
            <span className="text-gradient-brand">we install.</span>
          </>
        }
        description="Every CSGPL installation uses BIS-certified, tier-1 components — backed by manufacturer + installation warranties."
        aside={
          <Link to="/products" className="text-sm font-bold text-brand-700 arrow-link inline-flex items-center gap-1.5 mt-5">
            Browse full catalog <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* 5-up grid that collapses cleanly */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {lineup.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Single secondary CTA strip */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white border hairline p-5 shadow-soft">
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-extrabold text-ink-900">Need help selecting components?</h3>
          <p className="text-sm text-ink-600 mt-0.5">Our engineers help you spec the right products for your project.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button as="a" href="/products" variant="ghost" size="md">View all products</Button>
          <Button as="a" href="#consultation" size="md" trailingArrow>Get a quote</Button>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   PRODUCT CARD — compact, scannable, premium
   ============================================================ */

function ProductCard({ product }: { product: FeaturedProduct }) {
  const cat = getCategoryBySlug(product.categorySlug);
  const Icon = cat?.icon;
  const href = `/products/${product.categorySlug}/${product.slug}`;

  // Pick 2 most compelling specs (skip generic ones)
  const keySpecs = product.specs
    .filter((s) => !/origin|type/i.test(s.label))
    .slice(0, 2);

  return (
    <Card interactive padding="none" radius="lg" className="group flex flex-col h-full overflow-hidden">
      <Link to={href} className="flex flex-col h-full">
        {/* Image area — neutral background, no overlay clutter */}
        <div className="relative aspect-square bg-paper-2 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fallback="product"
            className="h-full w-full object-cover img-zoom"
          />
          {/* Category badge (top) */}
          {cat && (
            <div className="absolute top-3 left-3">
              <Badge tone="white" className="text-ink-900 font-bold inline-flex items-center gap-1.5">
                {Icon && <Icon className="h-3 w-3" />} {cat.shortName}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-700">{product.brand}</div>
          <h3 className="mt-1.5 text-base font-extrabold text-ink-900 leading-tight tracking-tight line-clamp-2">
            {product.title}
          </h3>
          <div className="text-xs text-ink-500 font-semibold mt-0.5">{product.subtitle}</div>

          {/* Two specs max */}
          <ul className="mt-3 space-y-1">
            {keySpecs.map((s) => (
              <li key={s.label} className="flex items-baseline justify-between gap-2 text-[11px]">
                <span className="text-ink-500 truncate">{s.label}</span>
                <span className="text-ink-900 font-bold truncate">{s.value}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-4 pt-3 border-t hairline flex items-center justify-between mt-auto">
            <span className="text-[11px] font-bold text-brand-700 inline-flex items-center gap-1">
              View details
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-ink-400 group-hover:text-brand-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
