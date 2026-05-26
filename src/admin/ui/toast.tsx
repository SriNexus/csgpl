/**
 * Toast system — minimal global notifier for admin actions.
 *
 * Usage:
 *   <ToastHost />                          ← mount once in admin layout
 *   toast.success("Saved!")                ← anywhere
 *   toast.error("Something failed")
 *
 * No context provider — uses a tiny module-scope subscriber pattern so any
 * call site (forms, hooks, services) can trigger toasts without prop drilling.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastTone = "success" | "error" | "info";
export interface ToastEntry {
  id: number;
  tone: ToastTone;
  message: string;
  /** ms until auto-dismiss. 0 = sticky. */
  duration: number;
}

type Listener = (toasts: ToastEntry[]) => void;

let entries: ToastEntry[] = [];
const listeners = new Set<Listener>();
let counter = 1;

function emit() { listeners.forEach((l) => l(entries.slice())); }

function push(tone: ToastTone, message: string, duration = 3200) {
  const id = counter++;
  entries = [{ id, tone, message, duration }, ...entries].slice(0, 5);
  emit();
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function dismiss(id: number) {
  entries = entries.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (msg: string, duration?: number) => push("success", msg, duration),
  error:   (msg: string, duration?: number) => push("error",   msg, duration ?? 5000),
  info:    (msg: string, duration?: number) => push("info",    msg, duration),
  dismiss,
};

/** Mount once near the root of the admin layout. */
export function ToastHost() {
  const [list, setList] = useState<ToastEntry[]>(entries);
  useEffect(() => {
    const l: Listener = (next) => setList(next);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
      {list.map((t) => <ToastCard key={t.id} entry={t} />)}
    </div>
  );
}

function ToastCard({ entry }: { entry: ToastEntry }) {
  const Icon = entry.tone === "success" ? CheckCircle2 : entry.tone === "error" ? AlertTriangle : Info;
  const tone =
    entry.tone === "success" ? "border-emerald-200 bg-white text-emerald-800" :
    entry.tone === "error"   ? "border-rose-200 bg-white text-rose-800" :
                               "border-ink-200 bg-white text-ink-800";
  const dot =
    entry.tone === "success" ? "bg-emerald-500" :
    entry.tone === "error"   ? "bg-rose-500" : "bg-brand-500";
  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-soft px-4 py-3 text-sm max-w-sm animate-fade-up ${tone}`}
      style={{ animationDuration: ".25s" }}
    >
      <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${dot}`} />
      <Icon className="h-4 w-4 mt-0.5 shrink-0 opacity-80" />
      <span className="font-medium leading-snug flex-1">{entry.message}</span>
      <button
        onClick={() => toast.dismiss(entry.id)}
        className="opacity-50 hover:opacity-100 shrink-0"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
