import CrudView from "./CrudView";
import type { TestimonialRecord } from "@/cms";
import { Star } from "lucide-react";

export default function TestimonialsView() {
  return (
    <CrudView<TestimonialRecord>
      title="Testimonials"
      subtitle="Customer reviews & ratings displayed on the homepage"
      collectionKey="testimonials"
      singular="Testimonial"
      columns={[
        { key: "name",   label: "Customer", render: (r) => <span className="font-semibold text-ink-900">{r.name}</span> },
        { key: "role",   label: "Role",     render: (r) => r.role,   responsive: "hidden sm:table-cell" },
        { key: "system", label: "System",   render: (r) => r.system, responsive: "hidden md:table-cell" },
        { key: "rating", label: "Rating",   render: (r) => (
            <span className="inline-flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: r.rating || 0 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
            </span>
          ) },
      ]}
      fields={[
        { key: "name",   label: "Customer Name", required: true },
        { key: "role",   label: "Role / City",   placeholder: "Homeowner • Lucknow" },
        { key: "system", label: "System",        placeholder: "5 KW Residential" },
        { key: "rating", label: "Rating",        type: "number", placeholder: "5" },
        { key: "text",   label: "Review",        type: "textarea", required: true },
      ]}
    />
  );
}
