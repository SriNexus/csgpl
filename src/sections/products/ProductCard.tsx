/**
 * ProductCard — reusable card used on the homepage + Products page +
 * category pages. Premium hover lift, gradient badge, CTA hint.
 */

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, Badge, Image } from "@/components/ui";
import type { FeaturedProduct } from "@/data/productsCatalog";
import { getCategoryBySlug } from "@/data/productsCatalog";

export interface ProductCardProps {
  product: FeaturedProduct;
  /** When true, renders a wide "feature" layout (image left, content right). */
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const cat = getCategoryBySlug(product.categorySlug);
  const Icon = cat?.icon;
  const accent = cat?.accent ?? { from: "from-brand-500", to: "to-brand-700" };
  const href = `/products/${product.categorySlug}/${product.slug}`;

  if (featured) {
    return (
      <Card interactive padding="none" radius="2xl" className="lg:col-span-7 group overflow-hidden">
        <Link to={href} className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="relative aspect-[16/10] lg:aspect-auto img-cinematic">
            <Image
              src={product.image}
              alt={product.title}
              fallback="product"
              className="h-full w-full object-cover img-zoom img-duotone"
              priority
            />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <Badge tone="amber" variant="loud">★ Featured</Badge>
              <Badge tone="white" variant="loud" className="text-brand-700">{product.brand}</Badge>
            </div>
          </div>
          <div className="p-7 sm:p-9 flex flex-col">
            <div className="inline-flex items-center gap-2">
              {Icon && (
                <span className={`h-8 w-8 rounded-lg bg-gradient-to-br ${accent.from} ${accent.to} text-white grid place-items-center`}>
                  <Icon className="h-4 w-4" />
                </span>
              )}
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">{cat?.name}</span>
            </div>
            <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900 leading-tight">
              {product.title}
              <span className="block text-base font-bold text-ink-500 mt-1">{product.subtitle}</span>
            </h3>
            <p className="mt-3 text-sm sm:text-[15px] text-ink-600 leading-relaxed">{product.shortDescription}</p>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-ink-700">
              {product.highlights.slice(0, 4).map((h) => (
                <li key={h} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 arrow-link">
                View product details
              </span>
              <ArrowUpRight className="h-5 w-5 text-ink-400 group-hover:text-brand-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card interactive padding="none" radius="xl" className="group overflow-hidden h-full">
      <Link to={href} className="block h-full">
        <div className="relative aspect-[4/3] img-cinematic">
          <Image
            src={product.image}
            alt={product.title}
            fallback="product"
            className="h-full w-full object-cover img-zoom"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge tone="white" className="text-ink-900">{product.brand}</Badge>
          </div>
          {Icon && (
            <div className={`absolute bottom-4 left-4 h-9 w-9 rounded-lg bg-gradient-to-br ${accent.from} ${accent.to} text-white grid place-items-center shadow-md`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-700">{cat?.name}</div>
          <h3 className="mt-1.5 text-lg font-bold text-ink-900 tracking-tight leading-snug">{product.title}</h3>
          <div className="text-xs text-ink-500 font-semibold mt-0.5">{product.subtitle}</div>
          <p className="mt-3 text-xs text-ink-600 leading-relaxed line-clamp-2">{product.shortDescription}</p>
          <div className="mt-4 pt-4 border-t hairline flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-700 inline-flex items-center gap-1 arrow-link">
              View details
            </span>
            <ArrowUpRight className="h-4 w-4 text-ink-400 group-hover:text-brand-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
