import { Sparkles, Users, IndianRupee, Eye, TrendingUp } from "lucide-react";
import { AdminCard, AdminPageHeader, AdminButton } from "@/admin/components";
import { useCmsCollection } from "@/cms";
import type { LeadRecord } from "@/cms";

export default function DashboardView() {
  const { data: leads, source } = useCmsCollection<LeadRecord>("leads");

  const stats = [
    { label: "Total Leads",  value: String(leads.length || 24), trend: "+18%", icon: Users,        color: "from-emerald-500 to-emerald-700" },
    { label: "Revenue (Est.)", value: "₹42.5L",                trend: "+24%", icon: IndianRupee,  color: "from-amber-500 to-orange-600" },
    { label: "Page Views",   value: "8,402",                   trend: "+12%", icon: Eye,          color: "from-blue-500 to-indigo-600" },
    { label: "Conversion",   value: "3.8%",                    trend: "+0.4%",icon: TrendingUp,   color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Welcome back 👋"
        subtitle="Here's what's happening with CSGPL today."
        source={source}
        action={<AdminButton><Sparkles className="h-4 w-4" /> Quick Action</AdminButton>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <AdminCard key={s.label} padding="md">
            <div className="flex items-center justify-between">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} text-white grid place-items-center shadow-md`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">{s.trend}</span>
            </div>
            <div className="mt-4 text-2xl font-extrabold text-ink-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-ink-900">Lead Trend (Last 7 days)</h3>
            <span className="text-xs text-gray-500">Auto-updated</span>
          </div>
          <FakeChart />
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-4">Recent Activity</h3>
          <ul className="space-y-4 text-sm">
            {[
              ["New lead", "Rajesh Kumar — Lucknow", "2m ago"],
              ["Blog published", "PM Surya Ghar Subsidy Guide", "1h ago"],
              ["Project added", "250KW @ Kanpur Factory", "4h ago"],
              ["Testimonial", "Priya Sharma — 5★", "1d ago"],
            ].map(([t, d, w], i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 grid place-items-center text-xs font-bold">
                  {t[0]}
                </div>
                <div className="flex-1">
                  <div className="text-ink-900 font-semibold">{t}</div>
                  <div className="text-gray-500 text-xs">{d}</div>
                </div>
                <div className="text-[11px] text-gray-400">{w}</div>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}

function FakeChart() {
  const data = [22, 38, 30, 52, 41, 60, 75];
  const max = Math.max(...data);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="h-56 flex items-end gap-3">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all hover:from-amber-500 hover:to-amber-300"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${v} leads`}
          />
          <div className="text-[11px] text-gray-500 font-semibold">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
