/**
 * ProductDetail — full product detail page.
 *   /products/:categorySlug/:slug
 *
 * Sections: Hero · Highlights · Spec groups · Applications · Warranty + Certs
 *           · Downloads · FAQ · Related · Inline + Final CTAs.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Check, Download, MessageCircle, Phone, Plus,
  ShieldCheck, FileText, Award, Tag,
} from "lucide-react";
import {
  Section, Heading, Lead, Card, Badge, Image, Backdrop, Button,
} from "@/components/ui";
import type { FeaturedProduct, ProductCategory } from "@/data/productsCatalog";
import { site } from "@/data/site";
import ProductCard from "./ProductCard";
import ProductsCta from "./ProductsCta";

export interface ProductDetailProps {
  product: FeaturedProduct;
  category: ProductCategory;
  related: FeaturedProduct[];
}

export default function ProductDetail({ product, category, related }: ProductDetailProps) {
  const Icon = category.icon;
  return (
    <>
      {/* HERO */}
      <Section tone="paper" padding="xl" className="pt-32 md:pt-40" backdrop={<Backdrop preset="aurora-light" />}>
        <Breadcrumbs category={category} product={product} />

        <div className="mt-6 grid lg:grid-cols-12 gap-10 items-start animate-fade-up">
          {/* Product image + quick chips */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5 img-cinematic">
              <Image
                src={product.image}
                alt={product.title}
                fallback="product"
                className="w-full aspect-[4/3] object-cover img-duotone"
                priority
              />
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <Badge tone="amber" variant="loud">★ {product.brand}</Badge>
              </div>
            </div>

            {/* Quick spec chips */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {product.specs.slice(0, 3).map((s) => (
                <div key={s.label} className="rounded-xl bg-white border hairline px-3 py-3 text-center shadow-soft">
                  <div className="text-[10px] uppercase tracking-wider text-ink-500">{s.label}</div>
                  <div className="text-sm font-extrabold text-ink-900 mt-1 leading-tight">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Title + CTAs */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${category.accent.from} ${category.accent.to} text-white grid place-items-center`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-700">{category.name}</span>
            </div>

            <Heading size="xl">
              {product.title}{" "}
              <span className="serif font-normal text-ink-600">{product.subtitle}</span>
            </Heading>
            <p className="mt-3 text-sm font-bold text-ink-700">{product.technology}</p>
            <Lead className="mt-5">{product.shortDescription}</Lead>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as="a" href="/#consultation" size="lg" trailingArrow>
                Get Quote
              </Button>
              <Button as="a" href="/#consultation" variant="ghost" size="lg" leading={<Download className="h-4 w-4 text-brand-600" />}>
                Request Datasheet
              </Button>
              <Button as="a" href={site.contact.whatsappWithMsg} variant="ghost" size="lg" leading={<MessageCircle className="h-4 w-4 text-brand-600" />}>
                Contact Expert
              </Button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-paper border hairline px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-700">
                    <Tag className="h-2.5 w-2.5" /> {t}
                  </span>
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <TrustItem label="Quality" value="Tier-1 Brand" />
              <TrustItem label="Warranty" value={shortWarranty(product) || "Manufacturer"} />
              <TrustItem label="EPC Support" value="Included" />
            </div>
          </div>
        </div>
      </Section>

      {/* HIGHLIGHTS / KEY FEATURES */}
      <Section tone="white" padding="lg">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-brand-600" /> Product Highlights
            </div>
            <Heading size="lg" className="mt-4">
              <span className="serif font-normal text-ink-600">Why choose</span> <br />
              <span className="text-gradient-brand">{product.title}?</span>
            </Heading>
            <p className="mt-5 text-ink-600 leading-relaxed">{product.whyChoose}</p>
          </div>

          <div className="lg:col-span-7">
            <Card padding="lg" surface="paper">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-800">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-brand-100 text-brand-700 grid place-items-center shrink-0">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* FULL SPEC GROUPS */}
      <Section tone="paper" padding="lg">
        <div className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-brand-600" /> Technical Specifications
        </div>
        <Heading size="lg" className="mt-4 mb-10">
          <span className="serif font-normal text-ink-600">Engineered</span>{" "}
          <span className="text-gradient-brand">for performance.</span>
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(product.specGroups ?? [{ title: "Specifications", rows: product.specs }]).map((group) => (
            <Card key={group.title} padding="none" surface="white" className="overflow-hidden">
              <div className="px-5 py-4 border-b hairline">
                <h3 className="font-bold text-ink-900">{group.title}</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {group.rows.map((s, i) => (
                    <tr key={`${s.label}-${i}`} className={`${i % 2 === 0 ? "" : "bg-paper/60"} border-b hairline last:border-0`}>
                      <td className="px-5 py-3 text-ink-600 font-semibold align-top w-1/2">{s.label}</td>
                      <td className="px-5 py-3 text-ink-900 font-medium">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      </Section>

      {/* APPLICATIONS + WARRANTY + CERTIFICATIONS */}
      <Section tone="white" padding="lg">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Applications */}
          <div className="lg:col-span-5">
            <div className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500" /> Applications
            </div>
            <Heading size="lg" className="mt-4">
              <span className="text-gradient-brand">Where it fits.</span>
            </Heading>

            <ul className="mt-8 space-y-3">
              {product.applications.map((a) => (
                <li key={a} className="flex items-start gap-3 rounded-xl bg-paper border hairline px-4 py-3">
                  <span className="mt-0.5 h-7 w-7 rounded-lg bg-brand-50 text-brand-700 grid place-items-center shrink-0 ring-1 ring-brand-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-ink-800 font-medium">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warranty + Certifications */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.warranty && product.warranty.length > 0 && (
              <Card padding="lg" surface="paper" className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-brand-600" />
                  <h3 className="font-bold text-ink-900">Warranty</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.warranty.map((w) => (
                    <div key={w.label} className="rounded-lg bg-white border hairline px-3 py-2.5">
                      <div className="text-[11px] uppercase tracking-wider text-ink-500 font-bold">{w.label}</div>
                      <div className="text-sm font-extrabold text-ink-900 mt-0.5">{w.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {product.certifications && product.certifications.length > 0 && (
              <Card padding="lg" surface="paper" className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-brand-600" />
                  <h3 className="font-bold text-ink-900">Certifications & Compliance</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.certifications.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-ink-800">
                      <Check className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" strokeWidth={3} />
                      {c}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </Section>

      {/* DOWNLOADS */}
      {product.downloads && product.downloads.length > 0 && (
        <Section tone="paper" padding="sm">
          <Card padding="lg" surface="white" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink-900">Downloads</h3>
                <p className="text-sm text-ink-600">Datasheets, certificates and installation guides</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.downloads.map((d) => (
                <Button key={d.label} as="a" href="/#consultation" variant="ghost" size="sm" leading={<Download className="h-3.5 w-3.5 text-brand-600" />}>
                  {d.label}
                </Button>
              ))}
            </div>
          </Card>
        </Section>
      )}

      {/* FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <Section tone="white" padding="lg">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-brand-600" /> Frequently Asked
              </div>
              <Heading size="lg" className="mt-4">
                Got questions? <br />
                <span className="text-gradient-brand">We've answered them.</span>
              </Heading>
              <p className="mt-5 text-sm text-ink-600">
                Couldn't find what you needed? Our solar experts respond to enquiries within 24 hours.
              </p>
              <Button as="a" href="/#consultation" variant="ghost" size="md" trailingArrow className="mt-5">
                Ask a question
              </Button>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {product.faqs.map((f, i) => (
                <FAQItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* INLINE CTA STRIP */}
      <Section tone="paper" padding="sm">
        <Card surface="white" padding="lg" className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-extrabold text-ink-900">Need help spec'ing for your project?</h3>
            <p className="text-sm text-ink-600 mt-1">Our solar engineers can recommend the optimal configuration.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button as="a" href={`tel:${site.contact.phonePrimaryRaw}`} variant="ghost" size="md" leading={<Phone className="h-4 w-4 text-brand-600" />}>
              Call expert
            </Button>
            <Button as="a" href="/#consultation" size="md" trailing={<ArrowRight className="h-4 w-4" />}>
              Get a quote
            </Button>
          </div>
        </Card>
      </Section>

      {/* RELATED */}
      {related.length > 0 && (
        <Section tone="white" padding="lg">
          <div className="flex items-end justify-between gap-3 flex-wrap mb-8">
            <div>
              <div className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-brand-600" /> More from {category.name}
              </div>
              <Heading size="lg" className="mt-3">
                <span className="serif font-normal text-ink-600">Related</span>{" "}
                <span className="text-gradient-brand">products.</span>
              </Heading>
            </div>
            <Link to={`/products/${category.slug}`} className="text-sm font-bold text-brand-700 arrow-link inline-flex items-center gap-1.5">
              View all {category.shortName} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      <ProductsCta />
    </>
  );
}

/* ============================================================
   HELPERS / SMALL COMPONENTS
   ============================================================ */

function Breadcrumbs({ category, product }: { category: ProductCategory; product: FeaturedProduct }) {
  return (
    <nav className="text-xs font-semibold text-ink-500 mb-2 flex items-center gap-2 flex-wrap">
      <Link to="/products" className="hover:text-brand-700">Products</Link>
      <span className="opacity-50">/</span>
      <Link to={`/products/${category.slug}`} className="hover:text-brand-700">{category.name}</Link>
      <span className="opacity-50">/</span>
      <span className="text-ink-700">{product.title}</span>
    </nav>
  );
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 border hairline px-3 py-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-500">
        <ShieldCheck className="h-3 w-3 text-brand-600" /> {label}
      </div>
      <div className="text-sm font-extrabold text-ink-900 mt-1 leading-tight">{value}</div>
    </div>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card padding="none" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-bold text-ink-900">{q}</span>
        <span className={`h-7 w-7 rounded-full grid place-items-center bg-paper-2 transition-transform shrink-0 ${open ? "rotate-45" : ""}`}>
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-ink-600 leading-relaxed">{a}</div>
      )}
    </Card>
  );
}

function shortWarranty(p: FeaturedProduct): string | undefined {
  const w = p.warranty?.find((s) => /warranty|years/i.test(s.label) || /year/i.test(s.value));
  if (!w) return undefined;
  return w.value.split(/[·•,]/)[0].trim();
}
