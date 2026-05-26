/**
 * BlogEditorView — full-page blog editor powered by FormRenderer.
 *
 *   /admin/blogs/new            → create a new post
 *   /admin/blogs/:id            → edit an existing post
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Save } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton,
} from "@/admin/components";
import { FormRenderer, validateSchema, hasErrors, type FormErrors } from "@/admin/forms";
import { useCmsCollection, type BlogRecord, type CategoryRecord } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";
import { excerpt as makeExcerpt, readingTime, renderMarkdown, toIso, uniqueSlug } from "@/utils/content";
import { buildBlogSchema } from "./blogSchema";

const DEFAULT_POST: Partial<BlogRecord> = {
  title: "",
  slug: "",
  status: "draft",
  body: "",
  tags: [],
};

export default function BlogEditorView() {
  const nav = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const posts      = useCmsCollection<BlogRecord>("blogs");
  const categories = useCmsCollection<CategoryRecord>("categories");
  const guard      = useDirtyGuard();

  const existing = useMemo(() => posts.data.find((p) => p.id === id), [posts.data, id]);

  const [draft, setDraft]   = useState<Partial<BlogRecord>>(DEFAULT_POST);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  // Hydrate when editing
  useEffect(() => {
    if (isNew) { setDraft(DEFAULT_POST); guard.markClean(); return; }
    if (existing) { setDraft(existing); guard.markClean(); }
  }, [isNew, existing]);  // eslint-disable-line react-hooks/exhaustive-deps

  const schema = useMemo(() => buildBlogSchema({
    categories: categories.data.map((c) => ({ value: c.slug, label: c.name })),
    existingSlugs: () => posts.data.filter((p) => p.id !== draft.id).map((p) => p.slug),
  }), [categories.data, posts.data, draft.id]);

  const stats = useMemo(() => readingTime(draft.body || ""), [draft.body]);

  async function onSave() {
    const next: Partial<BlogRecord> = { ...draft };

    // Auto-derive slug if missing
    if (!next.slug && next.title) {
      next.slug = uniqueSlug(next.title, posts.data.filter((p) => p.id !== next.id).map((p) => p.slug));
    }
    // Auto-derive excerpt if missing
    if (!next.excerpt && next.body) next.excerpt = makeExcerpt(next.body);
    // Set publishedAt on first publish
    if (next.status === "published" && !next.publishedAt) {
      next.publishedAt = toIso(new Date());
    }

    const validation = validateSchema(schema, next as any);
    setErrors(validation);
    if (hasErrors(validation)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    if (isNew) {
      const res = await posts.create(next as Omit<BlogRecord, "id">);
      setSaving(false);
      if (res.ok) {
        toast.success("Post created.");
        guard.markClean();
        nav("/admin/blogs", { replace: true });
      } else {
        toast.error(res.error || "Save failed");
      }
    } else {
      const res = await posts.update(id!, next);
      setSaving(false);
      if (res.ok) { toast.success("Post updated."); guard.markClean(); }
      else toast.error(res.error || "Save failed");
    }
  }

  return (
    <>
      <AdminPageHeader
        title={isNew ? "New Post" : draft.title || "Edit Post"}
        subtitle={
          isNew
            ? "Create a new article — saved to the blogs collection"
            : `${stats.words.toLocaleString()} words · ${stats.minutes} min read · slug: ${draft.slug || "—"}`
        }
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="ghost" size="md" onClick={() => nav("/admin/blogs")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </AdminButton>
            <AdminButton variant="ghost" size="md" onClick={() => setPreviewing((v) => !v)}>
              <Eye className="h-4 w-4" /> {previewing ? "Hide preview" : "Preview"}
            </AdminButton>
            <AdminButton onClick={onSave} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving…" : isNew ? "Create Post" : guard.dirty ? "Save Changes" : "Saved"}
            </AdminButton>
          </div>
        }
      />

      <div className={`grid gap-6 ${previewing ? "lg:grid-cols-5" : "grid-cols-1"}`}>
        <AdminCard className={previewing ? "lg:col-span-3" : ""}>
          <FormRenderer
            schema={schema}
            value={draft as Record<string, any>}
            errors={errors}
            onChange={(next) => setDraft(next)}
            onDirty={() => guard.markDirty()}
          />
        </AdminCard>

        {previewing && <BlogPreviewCard draft={draft} />}
      </div>
    </>
  );
}

function BlogPreviewCard({ draft }: { draft: Partial<BlogRecord> }) {
  const html = renderMarkdown(draft.body || "");
  return (
    <AdminCard className="lg:col-span-2 max-h-[80vh] overflow-y-auto">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500 font-bold mb-3">Live Preview</div>
      {draft.coverImage && (
        <img src={draft.coverImage} alt="" className="rounded-xl mb-4 w-full object-cover aspect-[16/9]" />
      )}
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 mb-2">{draft.title || "Untitled"}</h1>
      {draft.excerpt && <p className="text-sm text-ink-600 leading-relaxed mb-4">{draft.excerpt}</p>}
      <div className="prose-csgpl text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    </AdminCard>
  );
}
