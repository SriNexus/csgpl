import { cn } from "@/utils/cn";

/** Admin surface — white card with subtle border + soft shadow. */
export default function AdminCard({
  className,
  padding = "lg",
  children,
}: React.HTMLAttributes<HTMLDivElement> & { padding?: "none" | "sm" | "md" | "lg" }) {
  const pad = padding === "none" ? "" : padding === "sm" ? "p-4" : padding === "md" ? "p-5" : "p-6";
  return (
    <div className={cn("rounded-2xl bg-white border border-gray-100 shadow-soft", pad, className)}>
      {children}
    </div>
  );
}
