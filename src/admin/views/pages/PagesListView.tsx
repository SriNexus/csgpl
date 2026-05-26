import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  AdminPageHeader, AdminButton, AdminTable, ConfirmDialog,
} from "@/admin/components";
import { useCmsCollection, type PageRecord } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { formatDate } from "@/utils/content";

export default function PagesListView() {
  const nav = useNavigate();
  const { data, source, remove } = useCmsCollection<PageRecord>("pages");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function onConfirmDelete() {
    if (!confirmId) return;
    const res = await remove(confirmId as any);
    setConfirmId(null);
    if (res.ok) toast.success("Page deleted.");
    else toast.error(res.error || "Delete failed");
  }

  return (
    <>
      <AdminPageHeader
        title="Dynamic Pages"
        subtitle="Compose CMS-driven landing pages — rendered at /p/<slug>"
        source={source}
        action={
          <AdminButton onClick={() => nav("/admin/pages-builder/new")}>
            <Plus className="h-4 w-4" /> New Page
          </AdminButton>
        }
      />

      <AdminTable<PageRecord>
        rows={data}
        emptyTitle="No pages yet"
        emptySubtitle='Click "New Page" to compose a landing page.'
        onEdit={(r) => nav(`/admin/pages-builder/${r.id}`)}
        onDelete={(r) => setConfirmId(String(r.id))}
        columns={[
          { key: "title", label: "Title", render: (r) => <span className="font-semibold text-ink-900">{r.title}</span> },
          { key: "slug",  label: "Slug",  render: (r) => <code className="text-xs text-gray-600">/p/{r.slug}</code>, responsive: "hidden sm:table-cell" },
          { key: "status",label: "Status",render: (r) => (
              <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${r.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{r.status}</span>
          ) },
          { key: "sections", label: "Blocks", render: (r) => (r.sections?.length ?? 0).toString(), responsive: "hidden md:table-cell" },
          { key: "publishedAt", label: "Published", render: (r) => formatDate(r.publishedAt) || "—", responsive: "hidden lg:table-cell" },
        ]}
      />

      <ConfirmDialog
        open={!!confirmId}
        title="Delete page?"
        message="This action cannot be undone. The page will be permanently removed."
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
