import CrudView from "./CrudView";
import type { ProductRecord } from "@/cms";

export default function ProductsView() {
  return (
    <CrudView<ProductRecord>
      title="Products"
      subtitle="Solar product catalogue (panels, inverters, batteries, BOS)"
      collectionKey="products"
      singular="Product"
      columns={[
        { key: "title",   label: "Product",  render: (r) => <span className="font-semibold text-ink-900">{r.title}</span> },
        { key: "tagline", label: "Tagline",  render: (r) => r.tagline, responsive: "hidden sm:table-cell" },
        { key: "specs",   label: "Specs",    render: (r) => (r.specs || []).slice(0, 2).join(" · "), responsive: "hidden md:table-cell" },
      ]}
      fields={[
        { key: "title",   label: "Product Title", required: true },
        { key: "tagline", label: "Tagline",       placeholder: "Short positioning line" },
        { key: "img",     label: "Image",         type: "image" },
        { key: "color",   label: "Gradient",      placeholder: "from-amber-400 to-orange-500" },
      ]}
    />
  );
}
