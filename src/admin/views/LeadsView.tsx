import { AdminPageHeader, AdminTable } from "@/admin/components";
import { useCmsCollection, type LeadRecord } from "@/cms";

export default function LeadsView() {
  const { data, source } = useCmsCollection<LeadRecord>("leads");

  return (
    <>
      <AdminPageHeader
        title="Leads"
        subtitle="All consultation form submissions"
        source={source}
      />
      <AdminTable<LeadRecord>
        rows={data}
        emptyTitle="No leads yet"
        emptySubtitle="Submitted consultation forms will appear here."
        columns={[
          { key: "name",       label: "Name",   render: (r) => <span className="font-semibold text-ink-900">{r.name}</span> },
          { key: "phone",      label: "Phone",  render: (r) => r.phone },
          { key: "city",       label: "City",   render: (r) => r.city,        responsive: "hidden sm:table-cell" },
          { key: "systemType", label: "System", render: (r) => r.systemType,  responsive: "hidden md:table-cell" },
          { key: "monthlyBill",label: "Bill",   render: (r) => r.monthlyBill, responsive: "hidden lg:table-cell" },
          { key: "createdAt",  label: "When",   render: (r) => <span className="text-gray-500 text-xs">{formatWhen(r.createdAt)}</span> },
        ]}
      />
    </>
  );
}

function formatWhen(t?: string | number) {
  if (!t) return "just now";
  try {
    const d = new Date(t);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return String(t); }
}
