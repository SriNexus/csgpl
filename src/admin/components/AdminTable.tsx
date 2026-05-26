/**
 * AdminTable — generic, type-safe table.
 *
 *   <AdminTable
 *     rows={data}
 *     columns={[
 *       { key: "name", label: "Name", render: (r) => r.name },
 *       …
 *     ]}
 *     onEdit={(r) => …}
 *     onDelete={(r) => …}
 *   />
 */

import { Edit3, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  /** Render function — receives the row */
  render: (row: T) => React.ReactNode;
  /** Hide on narrow screens — accepts Tailwind class like `hidden sm:table-cell` */
  responsive?: string;
}

export interface AdminTableProps<T> {
  rows: T[];
  columns: AdminTableColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /** When provided, shown if rows.length === 0 */
  emptyTitle?: string;
  emptySubtitle?: string;
  /** Optional extra row classes */
  rowClassName?: (row: T) => string;
  rowKey?: (row: T) => string;
}

export default function AdminTable<T extends { id?: string | number }>({
  rows, columns, onEdit, onDelete, emptyTitle, emptySubtitle, rowClassName, rowKey,
}: AdminTableProps<T>) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }
  const showActions = !!onEdit || !!onDelete;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left text-[11px] uppercase tracking-wider">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-5 py-3 font-semibold ${c.responsive ?? ""}`}>{c.label}</th>
              ))}
              {showActions && <th className="px-5 py-3 text-right font-semibold">Action</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row) : (row.id ?? i)}
                className={`border-t border-gray-100 hover:bg-brand-50/30 ${rowClassName ? rowClassName(row) : ""}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3 text-ink-800 ${c.responsive ?? ""}`}>{c.render(row)}</td>
                ))}
                {showActions && (
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-gray-500 hover:text-brand-700 inline-flex items-center gap-1 text-xs font-bold mr-3"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-gray-500 hover:text-rose-600 inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
