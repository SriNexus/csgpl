import { cn } from "@/utils/cn";

type FieldShared = {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  error?: string;
};

type InputProps  = FieldShared & React.InputHTMLAttributes<HTMLInputElement>;
type SelectProps = FieldShared & React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] };

const fieldShellInput =
  "w-full rounded-xl bg-paper border hairline py-3 pl-10 pr-3 text-sm font-medium " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white " +
  "transition-all placeholder:text-ink-400";

const fieldShellSelect =
  "w-full appearance-none rounded-xl bg-paper border hairline py-3 pl-10 pr-9 text-sm font-medium " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all";

function FieldShell({
  label, icon, hint, error, children,
}: FieldShared & { children: React.ReactNode }) {
  return (
    <label className="block group">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700">{label}</span>
      <div className="mt-2 relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-600 transition-colors">
            {icon}
          </span>
        )}
        {children}
      </div>
      {hint && !error && <span className="mt-1 block text-[11px] text-ink-500">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  );
}

/** Input — canonical text input with editorial label & icon. */
export function Input({ label, icon, hint, error, className, ...rest }: InputProps) {
  return (
    <FieldShell label={label} icon={icon} hint={hint} error={error}>
      <input className={cn(fieldShellInput, !icon && "pl-3.5", className)} {...rest} />
    </FieldShell>
  );
}

/** Select — canonical select with editorial label & icon. */
export function Select({ label, icon, hint, error, options, className, ...rest }: SelectProps) {
  return (
    <FieldShell label={label} icon={icon} hint={hint} error={error}>
      <select className={cn(fieldShellSelect, !icon && "pl-3.5", className)} {...rest}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">▾</span>
    </FieldShell>
  );
}
