import { cn } from "@/utils/cn";

type StatProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Visual treatment */
  surface?: "glass" | "glass-dark" | "plain";
  /** When `divided`, draws a left/top divider per layout context */
  className?: string;
};

const surfaceClass = {
  "plain":      "",
  "glass":      "rounded-2xl glass p-5",
  "glass-dark": "rounded-2xl glass-dark p-5",
} as const;

/**
 * Stat — single KPI block. Used in:
 *   • Hero trust strip
 *   • RoiSavings counter grid
 *   • Dashboard metric cards (future)
 */
export default function Stat({
  label,
  value,
  hint,
  suffix,
  surface = "plain",
  className,
}: StatProps) {
  return (
    <div className={cn(surfaceClass[surface], className)}>
      <div className="text-[10px] uppercase tracking-[0.2em] text-current opacity-50">{label}</div>
      <div className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
        {value}
        {suffix && <span className="text-brand-500">{suffix}</span>}
      </div>
      {hint && <div className="mt-1.5 text-[11px] opacity-40">{hint}</div>}
    </div>
  );
}
