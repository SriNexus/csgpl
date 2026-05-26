import CrudView from "./CrudView";
import type { ProjectRecord } from "@/cms";

export default function ProjectsView() {
  return (
    <CrudView<ProjectRecord>
      title="Projects"
      subtitle="Manage installed solar project showcase"
      collectionKey="projects"
      singular="Project"
      columns={[
        { key: "title",   label: "Title",     render: (r) => <span className="font-semibold text-ink-900">{r.title}</span> },
        { key: "type",    label: "Type",      render: (r) => r.type,    responsive: "hidden sm:table-cell" },
        { key: "loc",     label: "Location",  render: (r) => r.loc,     responsive: "hidden md:table-cell" },
        { key: "kw",      label: "Capacity",  render: (r) => r.kw },
        { key: "savings", label: "Savings",   render: (r) => r.savings, responsive: "hidden lg:table-cell" },
      ]}
      fields={[
        { key: "title",   label: "Title",       required: true, placeholder: "e.g. Manufacturing Factory" },
        { key: "type",    label: "Type",        placeholder: "Industrial / Commercial / Residential" },
        { key: "loc",     label: "Location",    placeholder: "City, State" },
        { key: "kw",      label: "Capacity",    placeholder: "e.g. 250 KW" },
        { key: "savings", label: "Savings",     placeholder: "e.g. ₹28L / yr" },
        { key: "co2",     label: "CO₂ Offset",  placeholder: "e.g. 325 tonnes CO₂" },
        { key: "img",     label: "Image",       type: "image",    placeholder: "https://…" },
      ]}
    />
  );
}
