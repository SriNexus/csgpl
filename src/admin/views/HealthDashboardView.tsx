/**
 * HealthDashboardView — at-a-glance operational dashboard.
 *
 * Surfaces:
 *   • Firebase init status + bucket
 *   • Auth session type (firebase / demo / none)
 *   • Connectivity (online / offline / degraded)
 *   • Firestore + Storage call counters
 *   • Cache size + last invalidation
 *   • Recent diagnostics tail
 *
 * Read-only — for live ops monitoring without leaving the admin.
 */

import { useEffect, useState } from "react";
import { Activity, RefreshCw, Trash2 } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton,
} from "@/admin/components";
import { metrics } from "@/lib/logger";
import { diagnostics, type DiagEntry } from "@/cms/services/diagnostics";
import { connectivity, type ConnectivityStatus } from "@/cms/services/connectivity";
import { getFirebaseStatus, getFirebasePublicConfig } from "@/lib/firebase";
import { useAuth } from "@/admin/auth";

export default function HealthDashboardView() {
  const init   = getFirebaseStatus();
  const config = getFirebasePublicConfig();
  const { user, isAuthed } = useAuth();
  const [conn, setConn] = useState<ConnectivityStatus>(connectivity.status());
  const [counts, setCounts] = useState(metrics.snapshot());
  const [entries, setEntries] = useState<DiagEntry[]>(diagnostics.list());

  useEffect(() => connectivity.subscribe(setConn), []);
  useEffect(() => diagnostics.subscribe(setEntries), []);

  // Re-poll counters every 2 seconds (they're cheap)
  useEffect(() => {
    const id = window.setInterval(() => setCounts(metrics.snapshot()), 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Health Dashboard"
        subtitle="Live operational status of the CMS, Firebase, and uploads"
        action={
          <AdminButton variant="ghost" size="sm" onClick={() => diagnostics.clear()}>
            <Trash2 className="h-4 w-4" /> Clear log
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Firebase"
          ok={init.initialized}
          value={init.initialized ? "Connected" : "Disconnected"}
          hint={config.projectId}
        />
        <StatusCard
          label="Auth Session"
          ok={isAuthed}
          value={user?.email ? "Firebase" : isAuthed ? "Demo" : "None"}
          hint={user?.email || "—"}
        />
        <StatusCard
          label="Connectivity"
          ok={conn === "online"}
          value={conn === "online" ? "Online" : conn === "degraded" ? "Degraded" : "Offline"}
        />
        <StatusCard
          label="Storage Bucket"
          ok={init.storageOk}
          value={init.storageOk ? "Ready" : "Failed"}
          hint={config.storageBucket}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-ink-900 inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-600" /> Counters (since page load)
            </h3>
            <AdminButton variant="ghost" size="sm" onClick={() => { metrics.reset(); setCounts(metrics.snapshot()); }}>
              <RefreshCw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Counter label="Firestore reads"   value={counts.firestoreReads} />
            <Counter label="Firestore writes"  value={counts.firestoreWrites} />
            <Counter label="Storage uploads"   value={counts.storageUploads} />
            <Counter label="Storage deletes"   value={counts.storageDeletes} />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-3">Recent Diagnostics ({entries.length})</h3>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No events yet.</p>
          ) : (
            <ul className="space-y-1 max-h-72 overflow-y-auto pr-2">
              {entries.slice(0, 20).map((e) => (
                <li
                  key={e.id}
                  className={`text-[11px] rounded px-2 py-1 border flex items-start gap-2 ${
                    e.severity === "error" ? "bg-rose-50 border-rose-200 text-rose-800" :
                    e.severity === "warn"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                                             "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <span className="font-mono opacity-60 shrink-0">{new Date(e.time).toLocaleTimeString()}</span>
                  <span className="font-bold uppercase tracking-wider shrink-0">{e.severity}</span>
                  <span className="font-mono opacity-70 shrink-0">{e.scope}</span>
                  <span className="truncate">{e.message}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

function StatusCard({
  label, value, hint, ok,
}: { label: string; value: string; hint?: string; ok: boolean }) {
  return (
    <AdminCard padding="md">
      <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} />
        <span className="text-lg font-extrabold text-ink-900">{value}</span>
      </div>
      {hint && <div className="mt-1 text-[11px] font-mono text-ink-500 truncate">{hint}</div>}
    </AdminCard>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-paper border border-gray-100 px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
