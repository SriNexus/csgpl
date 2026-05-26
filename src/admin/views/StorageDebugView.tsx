/**
 * StorageDebugView — runtime diagnostic console for the upload pipeline.
 *
 * Shows:
 *   • Firebase init status + storage bucket
 *   • Current admin session (uid / email)
 *   • One-click "Run Health Check" — round-trips a sample file
 *   • Live tail of structured diagnostics from cmsStorage / image processor
 *
 * Mounted at `/admin/debug/storage`.
 */

import { useEffect, useState } from "react";
import { Play, RefreshCw, Trash2 } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton, Skeleton,
} from "@/admin/components";
import { diagnostics, type DiagEntry } from "@/cms/services/diagnostics";
import { runStorageHealthCheck, type HealthReport } from "@/cms/services/storageHealth";
import { getFirebaseStatus, getFirebasePublicConfig } from "@/lib/firebase";
import { useAuth } from "@/admin/auth";

export default function StorageDebugView() {
  const status = getFirebaseStatus();
  const config = getFirebasePublicConfig();
  const { user, isAuthed } = useAuth();

  const [entries, setEntries] = useState<DiagEntry[]>([]);
  const [report, setReport]   = useState<HealthReport | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => diagnostics.subscribe(setEntries), []);

  async function runCheck() {
    setRunning(true);
    setReport(null);
    try { setReport(await runStorageHealthCheck()); }
    finally { setRunning(false); }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Storage Diagnostics"
        subtitle="Validate the Firebase Storage + Auth + Firestore upload pipeline end-to-end"
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="ghost" size="sm" onClick={() => diagnostics.clear()}>
              <Trash2 className="h-4 w-4" /> Clear log
            </AdminButton>
            <AdminButton onClick={runCheck} disabled={running}>
              {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run health check
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-3">Firebase Init</h3>
          <Row label="App initialised"        ok={status.appOk} />
          <Row label="Firestore ready"        ok={status.firestoreOk} />
          <Row label="Auth ready"             ok={status.authOk} />
          <Row label="Storage ready"          ok={status.storageOk} hint={status.bucket || undefined} />
          {status.errors.length > 0 && (
            <pre className="mt-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-md p-3 whitespace-pre-wrap">
              {status.errors.map((e) => `[${e.scope}] ${e.message}`).join("\n")}
            </pre>
          )}
        </AdminCard>

        <AdminCard>
          <h3 className="font-bold text-ink-900 mb-3">Active Configuration</h3>
          <Row label="Project ID"      hint={config.projectId} ok />
          <Row label="Auth Domain"     hint={config.authDomain} ok />
          <Row label="Storage Bucket"  hint={config.storageBucket} ok />
          <div className="mt-3 border-t border-gray-100 pt-3" />
          <Row label="Admin signed in" ok={isAuthed} hint={user?.email || (isAuthed ? "(demo session)" : undefined)} />
        </AdminCard>
      </div>

      <AdminCard>
        <h3 className="font-bold text-ink-900 mb-3">Health Check Result</h3>
        {running ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ) : report ? (
          <div className="space-y-2 text-sm">
            <ul className="space-y-1.5">
              {report.steps.map((s, i) => (
                <li key={i} className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 border ${
                  s.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
                }`}>
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    {s.error && <div className="text-[11px] mt-0.5">{s.error}</div>}
                    {s.details?.remedy && <div className="text-[11px] mt-0.5 italic">Fix: {s.details.remedy}</div>}
                  </div>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">
                    {s.ok ? "OK" : "FAIL"}{typeof s.ms === "number" ? ` · ${s.ms}ms` : ""}
                  </span>
                </li>
              ))}
            </ul>
            {report.sampleUrl && (
              <div className="mt-3 text-xs">
                <span className="font-semibold text-ink-700">Sample URL: </span>
                <a href={report.sampleUrl} target="_blank" rel="noreferrer" className="text-brand-700 underline break-all">
                  {report.sampleUrl}
                </a>
              </div>
            )}
            <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
              report.ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}>
              {report.ok ? "All checks passed" : "Health check failed"}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Click "Run health check" to perform a sample upload round-trip.</p>
        )}
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-ink-900">Diagnostic Log <span className="text-gray-400 font-normal">({entries.length})</span></h3>
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No diagnostics recorded yet — upload an image or run the health check.</p>
        ) : (
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
            {entries.map((e) => <LogRow key={e.id} entry={e} />)}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function Row({ label, ok, hint }: { label: string; ok?: boolean; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <span className="inline-flex items-center gap-2 text-xs">
        {hint && <span className="text-gray-500 font-mono">{hint}</span>}
        <span className={`h-2 w-2 rounded-full ${ok === undefined ? "bg-gray-300" : ok ? "bg-emerald-500" : "bg-rose-500"}`} />
        <span className={`font-bold text-[10px] uppercase tracking-wider ${ok ? "text-emerald-700" : "text-rose-700"}`}>
          {ok === undefined ? "" : ok ? "OK" : "FAIL"}
        </span>
      </span>
    </div>
  );
}

function LogRow({ entry }: { entry: DiagEntry }) {
  const ts = new Date(entry.time).toLocaleTimeString();
  const tone =
    entry.severity === "error" ? "bg-rose-50 text-rose-800 border-rose-200" :
    entry.severity === "warn"  ? "bg-amber-50 text-amber-800 border-amber-200" :
    entry.severity === "info"  ? "bg-paper text-ink-800 border-gray-200" :
                                 "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <li className={`rounded-lg border px-3 py-1.5 text-xs ${tone}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] opacity-70">{ts}</span>
        <span className="font-bold uppercase tracking-wider text-[10px]">{entry.severity}</span>
        <span className="font-mono text-[10px]">{entry.scope}</span>
      </div>
      <div className="mt-0.5 font-medium">{entry.message}</div>
      {entry.data !== undefined && (
        <details className="mt-1 text-[10px] opacity-80">
          <summary className="cursor-pointer">data</summary>
          <pre className="mt-1 whitespace-pre-wrap break-all">{safeJson(entry.data)}</pre>
        </details>
      )}
    </li>
  );
}

function safeJson(v: any): string {
  try { return JSON.stringify(v, null, 2); }
  catch { return String(v); }
}
