/**
 * BlogsListView — table of all blog posts with quick status indicators
 * and links to the editor.
 */

import { useNavigate } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import {
  AdminPageHeader, AdminButton, AdminTable, ConfirmDialog,
} from "@/admin/components";
import { useCmsCollection, type BlogRecord } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { formatDate } from "@/utils/content";
import { useState } from "react";

export default function BlogsListView() {
  const nav = useNavigate();
  const { data, source, remove } = useCmsCollection<BlogRecord>("blogs");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function onConfirmDelete() {
    if (!confirmId) return;
    const res = await remove(confirmId as any);
    setConfirmId(null);
    if (res.ok) toast.success("Post deleted.");
    else toast.error(res.error || "Delete failed");
  }

  return (
    <>
      <AdminPageHeader
        title="Blog Posts"
        subtitle="Create & manage SEO-driven blog content"
        source={source}
        action={
          <AdminButton onClick={() => nav("/admin/blogs/new")}>
            <Plus className="h-4 w-4" /> New Post
          </AdminButton>
        }
      />

      <AdminTable<BlogRecord>
        rows={data}
        emptyTitle="No posts yet"
        emptySubtitle='Click "New Post" to publish your first article.'
        onEdit={(r) => nav(`/admin/blogs/${r.id}`)}
        onDelete={(r) => setConfirmId(String(r.id))}
        columns={[
          { key: "title", label: "Title", render: (r) => (
            <span className="font-semibold text-ink-900 inline-flex items-center gap-2">
              {r.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
              {r.title}
            </span>
          ) },
          { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-gray-600">{r.slug}</code>, responsive: "hidden sm:table-cell" },
          { key: "author", label: "Author", render: (r) => r.author || "—", responsive: "hidden lg:table-cell" },
          { key: "status", label: "Status", render: (r) => (
            <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
              r.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
            }`}>
              {r.status}
            </span>
          ) },
          { key: "publishedAt", label: "Published", render: (r) => formatDate(r.publishedAt) || "—", responsive: "hidden md:table-cell" },
        ]}
      />

      <ConfirmDialog
        open={!!confirmId}
        title="Delete post?"
        message="This action cannot be undone. The post will be permanently removed."
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
