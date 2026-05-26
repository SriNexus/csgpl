import { Inbox } from "lucide-react";

/** Empty-state for admin tables / lists. */
export default function EmptyState({
  title = "Nothing here yet",
  subtitle,
  action,
  icon,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
      <div className="h-14 w-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 grid place-items-center">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
