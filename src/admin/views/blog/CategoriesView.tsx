/**
 * CategoriesView — manage blog categories.
 * Powered by the generic CrudView for now (small data).
 */

import CrudView from "../CrudView";
import type { CategoryRecord } from "@/cms";

export default function CategoriesView() {
  return (
    <CrudView<CategoryRecord>
      title="Blog Categories"
      subtitle="Used to filter & group articles on the public blog"
      collectionKey="categories"
      singular="Category"
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-semibold text-ink-900">{r.name}</span> },
        { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-gray-600">{r.slug}</code>, responsive: "hidden sm:table-cell" },
        { key: "description", label: "Description", render: (r) => r.description || "—", responsive: "hidden md:table-cell" },
      ]}
      fields={[
        { key: "name", label: "Name",        required: true },
        { key: "slug", label: "Slug",        required: true, placeholder: "url-slug" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "color", label: "Accent (brand | amber)", placeholder: "brand" },
      ]}
    />
  );
}
