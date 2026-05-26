/**
 * CategoryPage — landing page for a single product category.
 *   /products/:categorySlug
 *
 * Renders a category-specific filter bar based on the category slug:
 *   • solar-panels → brand tabs (Emmvee / Jakson / RenewSys)
 *   • inverters    → on-grid / hybrid / off-grid + 1P/3P
 *   • batteries    → LV / HV
 *   • solar-bos    → product type filter
 *   • accessories  → grid + accessory catalog block
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import { Section, Heading, Lead, Backdrop, Card } from "@/components/ui";
import type {
  ProductCategory, FeaturedProduct,
} from "@/data/productsCatalog";
import { accessoryCatalog, getBrandsForCategory } from "@/data/productsCatalog";
import ProductCard from "./ProductCard";
import ProductsCta from "./ProductsCta";

export interface CategoryPageProps {
  category: ProductCategory;
  products: FeaturedProduct[];
}

export default function CategoryPage({ category, products }: CategoryPageProps) {
  const Icon = category.icon;
  return (
    <>
      {/* Hero */}
      <Section tone="paper" padding="xl" className="pt-32 md:pt-40" backdrop={<Backdrop preset="aurora-light" />}>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-brand-700 uppercase tracking-wider">
          <ArrowLeft className="h-3.5 w-3.5" /> All products
        </Link>

        <div className="mt-6 grid lg:grid-cols-12 gap-10 items-center animate-fade-up">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${category.accent.from} ${category.accent.to} text-white grid place-items-center shadow-md`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-brand-700">{category.tagline}</span>
            </div>

            <Heading size="xl">{category.name}</Heading>
            <Lead className="mt-5 text-[1.05rem]">{category.description}</Lead>
          </div>

          <div className="lg:col-span-5">
            <Card surface="white" padding="lg" className="shadow-soft">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-500 mb-4">Key specifications</div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {category.stats.map((s) => (
                  <li key={s.label} className="rounded-xl bg-paper border hairline px-3 py-3 text-center">
                    <div className="text-lg font-extrabold text-ink-900 tracking-tight">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500 mt-1">{s.label}</div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* Category-specific filtered listing */}
      {category.slug === "solar-panels" && <PanelsListing products={products} category={category} />}
      {category.slug === "inverters"    && <InvertersListing products={products} category={category} />}
      {category.slug === "batteries"    && <BatteriesListing products={products} category={category} />}
      {category.slug === "solar-bos"    && <BosListing products={products} category={category} />}
      {category.slug === "accessories"  && <AccessoriesListing products={products} category={category} />}

      <ProductsCta />
    </>
  );
}

/* ============================================================
   SHARED — empty/coming-soon block
   ============================================================ */

function ComingSoonGrid({ category }: { category: ProductCategory }) {
  return (
    <Section tone="white" padding="lg">
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-paper p-12 text-center">
        <p className="text-ink-600">More {category.shortName.toLowerCase()} arriving soon.</p>
      </div>
    </Section>
  );
}

/* ============================================================
   1. SOLAR PANELS — Brand tabs
   ============================================================ */

function PanelsListing({
  products, category,
}: { products: FeaturedProduct[]; category: ProductCategory }) {
  const brands = useMemo(() => [
    { slug: "", name: "All Brands" },
    ...getBrandsForCategory(category.slug),
  ], [category.slug]);

  const [activeBrand, setActiveBrand] = useState("");
  const filtered = useMemo(
    () => activeBrand ? products.filter((p) => p.brandSlug === activeBrand) : products,
    [products, activeBrand],
  );

  return (
    <>
      <Section tone="white" padding="lg">
        <FilterBar
          label="Brand"
          options={brands.map((b) => ({ value: b.slug, label: b.name }))}
          active={activeBrand}
          onChange={setActiveBrand}
        />
        <ProductGrid products={filtered} />

        {/* Quick comparison */}
        {filtered.length > 1 && (
          <div className="mt-12">
            <h3 className="text-2xl font-extrabold text-ink-900 mb-2">Quick Comparison</h3>
            <p className="text-sm text-ink-600 mb-6">Compare key specifications across panel models in this category.</p>
            <ComparisonTable products={filtered} />
          </div>
        )}
      </Section>
      {filtered.length === 0 && <ComingSoonGrid category={category} />}
    </>
  );
}

/* ============================================================
   2. INVERTERS — Type + phase filter
   ============================================================ */

function InvertersListing({
  products, category,
}: { products: FeaturedProduct[]; category: ProductCategory }) {
  // Heuristic-based classification — derived from product title / tags
  const classify = (p: FeaturedProduct) => {
    const t = (p.title + " " + p.subtitle + " " + (p.tags || []).join(" ")).toLowerCase();
    const type =
      /off[\s-]?grid|standalone/.test(t) ? "off-grid" :
      /hybrid/.test(t)                  ? "hybrid"    :
                                          "on-grid";
    const phase =
      /three\s*phase|3p|3-phase/.test(t) ? "3p" :
      /single\s*phase|1p|1-phase/.test(t) ? "1p" :
                                            "both";
    return { type, phase };
  };

  const enriched = useMemo(() => products.map((p) => ({ p, ...classify(p) })), [products]);
  const [type,  setType]  = useState<string>("");
  const [phase, setPhase] = useState<string>("");

  const filtered = useMemo(() => {
    return enriched
      .filter((x) => !type  || x.type  === type)
      .filter((x) => !phase || x.phase === phase || x.phase === "both")
      .map((x) => x.p);
  }, [enriched, type, phase]);

  return (
    <>
      <Section tone="white" padding="lg">
        <FilterBar
          label="Type"
          options={[
            { value: "",        label: "All Types" },
            { value: "on-grid", label: "On-Grid" },
            { value: "hybrid",  label: "Hybrid" },
            { value: "off-grid",label: "Off-Grid" },
          ]}
          active={type}
          onChange={setType}
        />
        <div className="mt-3">
          <FilterBar
            label="Phase"
            options={[
              { value: "",   label: "All Phases" },
              { value: "1p", label: "Single Phase" },
              { value: "3p", label: "Three Phase" },
            ]}
            active={phase}
            onChange={setPhase}
          />
        </div>

        <ProductGrid products={filtered} />
      </Section>
      {filtered.length === 0 && <ComingSoonGrid category={category} />}
    </>
  );
}

/* ============================================================
   3. BATTERIES — LV / HV segmentation
   ============================================================ */

function BatteriesListing({
  products, category,
}: { products: FeaturedProduct[]; category: ProductCategory }) {
  const segment = (p: FeaturedProduct) =>
    /\bhv\b|high[\s-]?voltage|150|200\s*v/i.test(`${p.title} ${p.subtitle}`)
      ? "hv" : "lv";

  const [seg, setSeg] = useState<string>("");
  const filtered = useMemo(
    () => seg ? products.filter((p) => segment(p) === seg) : products,
    [products, seg],
  );

  return (
    <>
      <Section tone="white" padding="lg">
        <FilterBar
          label="Voltage class"
          options={[
            { value: "",   label: "All Batteries" },
            { value: "lv", label: "LV (51.2 V) · for 1P Hybrid" },
            { value: "hv", label: "HV (150–200 V) · for 3P Hybrid" },
          ]}
          active={seg}
          onChange={setSeg}
        />

        {/* Compatibility note */}
        <Card padding="md" surface="paper" className="mt-6">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-700 grid place-items-center ring-1 ring-brand-100 shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div className="text-sm text-ink-700">
              <strong className="text-ink-900">Inverter compatibility:</strong> LV lithium batteries pair with Feston Vega <em>single-phase</em> hybrid inverters (3–6 kW). HV lithium batteries pair with Vega <em>three-phase</em> hybrid inverters (10–20 kW).
            </div>
          </div>
        </Card>

        <ProductGrid products={filtered} />
      </Section>
      {filtered.length === 0 && <ComingSoonGrid category={category} />}
    </>
  );
}

/* ============================================================
   4. SOLAR BOS — type filter
   ============================================================ */

function BosListing({
  products, category,
}: { products: FeaturedProduct[]; category: ProductCategory }) {
  const classify = (p: FeaturedProduct) => {
    const t = (p.title + " " + p.subtitle).toLowerCase();
    if (/mounting|structure/.test(t))     return "structure";
    if (/acdb|dcdb|protection/.test(t))   return "protection";
    if (/cable/.test(t))                  return "cable";
    if (/earth|grounding/.test(t))        return "earthing";
    return "other";
  };

  const [seg, setSeg] = useState<string>("");
  const filtered = useMemo(
    () => seg ? products.filter((p) => classify(p) === seg) : products,
    [products, seg],
  );

  return (
    <>
      <Section tone="white" padding="lg">
        <FilterBar
          label="BOS type"
          options={[
            { value: "",          label: "All BOS" },
            { value: "structure", label: "Mounting Structures" },
            { value: "protection",label: "ACDB / DCDB" },
            { value: "cable",     label: "DC / AC Cables" },
            { value: "earthing",  label: "Earthing" },
          ]}
          active={seg}
          onChange={setSeg}
        />
        <ProductGrid products={filtered} />
      </Section>
      {filtered.length === 0 && <ComingSoonGrid category={category} />}
    </>
  );
}

/* ============================================================
   5. ACCESSORIES — products grid + compact accessory catalog
   ============================================================ */

function AccessoriesListing({
  products, category,
}: { products: FeaturedProduct[]; category: ProductCategory }) {
  return (
    <>
      <Section tone="white" padding="lg">
        <h3 className="text-2xl font-extrabold text-ink-900 mb-1">Featured Accessory Products</h3>
        <p className="text-sm text-ink-600 mb-6">Detailed product pages with full technical specifications.</p>
        <ProductGrid products={products} />
      </Section>

      {/* Full accessory catalog table */}
      <Section tone="paper" padding="lg">
        <div className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-rose-500" /> Complete Accessory Catalog
        </div>
        <Heading size="lg" className="mt-4 mb-3">
          <span className="serif font-normal text-ink-600">Every component</span>{" "}
          <span className="text-gradient-brand">a solar installation needs.</span>
        </Heading>
        <p className="text-sm text-ink-600 mb-8 max-w-2xl">
          Bundle accessories with your solar installation or request a quote for specific accessory items.
          All accessories grade-matched to the installation environment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessoryCatalog.map((a) => (
            <Card key={a.name} padding="lg" surface="white" interactive>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-ink-900">{a.name}</h4>
              </div>
              <p className="text-sm text-ink-600 leading-relaxed">{a.description}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-paper border hairline px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-700">
                {a.standard}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/#consultation"
            className="inline-flex items-center gap-3 rounded-full bg-ink-900 text-white pl-6 pr-2 py-2.5 text-sm font-bold hover:bg-brand-700 transition-colors"
          >
            Request Bundle Quote
            <span className="h-9 w-9 rounded-full bg-white text-ink-900 grid place-items-center">→</span>
          </Link>
        </div>
      </Section>

      {category && null /* category referenced for prop compat */}
    </>
  );
}

/* ============================================================
   SHARED — Filter bar & product grid
   ============================================================ */

function FilterBar({
  label, options, active, onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-6">
      <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-500 shrink-0">{label}:</span>
      {options.map((o) => {
        const isActive = o.value === active;
        return (
          <button
            key={o.value || "all"}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
              isActive
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-ink-700 border-ink-900/10 hover:border-brand-400 hover:text-brand-700"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ProductGrid({ products }: { products: FeaturedProduct[] }) {
  if (products.length === 0) {
    return (
      <Card padding="xl" className="text-center mt-6">
        <p className="text-ink-600">No products match the current filter — try clearing it.</p>
      </Card>
    );
  }
  const [hero, ...rest] = products;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
      <ProductCard product={hero} featured />
      {rest.length > 0 && (
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {rest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function ComparisonTable({ products }: { products: FeaturedProduct[] }) {
  // Limit columns to first 3 to fit the layout cleanly
  const cols = products.slice(0, 3);

  // Choose key spec labels for the comparison
  const KEY_LABELS = ["Power", "Efficiency", "Technology", "Cells", "Bifaciality", "Warranty"];

  function valueFor(p: FeaturedProduct, label: string): string {
    return p.specs.find((s) => s.label === label)?.value ?? "—";
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-paper border-b hairline">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider font-bold text-ink-500 w-1/4">Spec</th>
              {cols.map((p) => (
                <th key={p.id} className="px-5 py-3 text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-brand-700">{p.brand}</div>
                  <div className="text-sm font-extrabold text-ink-900 mt-0.5">{p.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KEY_LABELS.map((label, i) => (
              <tr key={label} className={`${i % 2 === 0 ? "" : "bg-paper/60"} border-b hairline last:border-0`}>
                <td className="px-5 py-3 text-ink-600 font-semibold">{label}</td>
                {cols.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-ink-900 font-medium">{valueFor(p, label)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-5 py-3 text-ink-600 font-semibold">Action</td>
              {cols.map((p) => (
                <td key={p.id} className="px-5 py-3">
                  <Link
                    to={`/products/${p.categorySlug}/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                  >
                    View details →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
