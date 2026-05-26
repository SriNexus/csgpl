import { cn } from "@/utils/cn";

type Variant = "primary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost:   "bg-white border border-gray-200 text-ink-900 hover:border-brand-400 hover:text-brand-700 transition",
  danger:  "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition",
  subtle:  "bg-gray-100 text-ink-800 hover:bg-gray-200 transition",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

/** Lightweight button for the admin surface — distinct from public-site `Button`. */
export default function AdminButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-xl font-semibold no-tap",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
