/** Standard admin page header: title + subtitle + optional action slot. */
export default function AdminPageHeader({
  title, subtitle, action, source,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** Show the data source pill (firestore / local / fallback) */
  source?: "firestore" | "local" | "fallback";
}) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900">{title}</h1>
          {source && <SourcePill source={source} />}
        </div>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function SourcePill({ source }: { source: "firestore" | "local" | "fallback" }) {
  const map = {
    firestore: { dot: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Live" },
    local:     { dot: "bg-amber-500",   text: "text-amber-700 bg-amber-50 border-amber-200",      label: "Local" },
    fallback:  { dot: "bg-gray-400",    text: "text-gray-600 bg-gray-100 border-gray-200",        label: "Default" },
  }[source];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
      {map.label}
    </span>
  );
}
