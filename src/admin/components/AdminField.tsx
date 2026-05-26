import { cn } from "@/utils/cn";

/** Admin form field with uppercase micro-label. */
export function AdminField({
  label, children, hint, error,
}: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none " +
  "focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white placeholder:text-gray-400";

export function AdminInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseInput, className)} {...rest} />;
}

export function AdminTextarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(baseInput, "leading-relaxed", className)} {...rest} />;
}

export function AdminSelect({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(baseInput, "appearance-none pr-8", className)} {...rest}>
      {children}
    </select>
  );
}
