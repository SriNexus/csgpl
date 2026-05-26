import { AdminCard, AdminPageHeader } from "@/admin/components";

export default function AnalyticsView() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Analytics" subtitle="Track traffic, conversions & lead sources" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-4">Traffic Sources</h3>
          {[
            ["Organic Search", 62, "from-emerald-500 to-emerald-700"],
            ["Direct",         18, "from-amber-500 to-orange-500"],
            ["Social Media",   12, "from-blue-500 to-indigo-600"],
            ["Referral",        8, "from-rose-500 to-pink-600"],
          ].map(([n, v, c]) => (
            <div key={n as string} className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-ink-800">{n}</span>
                <span className="text-gray-500">{v}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${c}`} style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-4">Top Pages</h3>
          <ul className="space-y-3 text-sm">
            {[
              ["/", 4220],
              ["/products", 1810],
              ["/solar-for-need", 1240],
              ["/blog", 820],
              ["/contact", 312],
            ].map(([p, v]) => (
              <li key={p as string} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                <span className="font-semibold text-ink-800">{p}</span>
                <span className="text-gray-500">{(v as number).toLocaleString()} views</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
