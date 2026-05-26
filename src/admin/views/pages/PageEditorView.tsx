/**
 * PageEditorView — compose dynamic pages from typed block primitives.
 * Each block has its own form schema, fed into the FormRenderer.
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton,
} from "@/admin/components";
import { FormRenderer, validateSchema, hasErrors, type FormSchema, type FormErrors } from "@/admin/forms";
import { useCmsCollection, type PageRecord, type PageSectionBlock } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";
import { toIso, uniqueSlug } from "@/utils/content";

/* ============================================================
   META schema — title / slug / status / SEO
   ============================================================ */
function buildMetaSchema(existing: () => readonly string[]): FormSchema {
  return [
    { key: "title", label: "Page Title", type: "text", required: true, span: 2 },
    { key: "slug",  label: "Slug",       type: "slug", sourceKey: "title", existing, required: true, span: 1 },
    { key: "status",label: "Status",     type: "select", required: true, span: 1, default: "draft",
      options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
    {
      key: "_seoGroup", label: "SEO overrides", type: "group", span: 2,
      description: "Leave empty to inherit the global homepage SEO.",
      fields: [
        { key: "seoTitle",       label: "Meta Title",       type: "text",     span: 2 },
        { key: "seoDescription", label: "Meta Description", type: "textarea", span: 2 },
        { key: "ogImage",        label: "OG Image URL",     type: "url",      span: 2 },
        { key: "canonical",      label: "Canonical URL",    type: "url",      span: 2 },
      ],
    },
  ];
}

/* ============================================================
   BLOCK schemas — one per kind
   ============================================================ */
const blockSchemas: Record<PageSectionBlock["kind"], FormSchema> = {
  hero: [
    { key: "eyebrow",     label: "Eyebrow",     type: "text" },
    { key: "title",       label: "Title",       type: "text", required: true, span: 2 },
    { key: "description", label: "Description", type: "textarea", span: 2 },
    { key: "image",       label: "Image",       type: "image", folder: "pages", span: 2 },
  ],
  richText: [
    { key: "markdown", label: "Markdown content", type: "markdown", required: true, span: 2 },
  ],
  image: [
    { key: "src",     label: "Image",   type: "image", folder: "pages", required: true, span: 2 },
    { key: "alt",     label: "Alt text",type: "text" },
    { key: "caption", label: "Caption", type: "text" },
  ],
  cta: [
    { key: "title",       label: "Title",      type: "text", required: true },
    { key: "description", label: "Description",type: "textarea", span: 2 },
    { key: "buttonLabel", label: "Button label", type: "text", required: true },
    { key: "buttonHref",  label: "Button URL",   type: "url",  required: true },
  ],
};

const blockLabels: Record<PageSectionBlock["kind"], string> = {
  hero: "Hero", richText: "Rich Text", image: "Image", cta: "Call to Action",
};

function newBlock(kind: PageSectionBlock["kind"]): PageSectionBlock {
  const id = `b-${Date.now()}-${Math.floor(Math.random() * 999)}`;
  switch (kind) {
    case "hero":     return { kind, id, title: "New hero" };
    case "richText": return { kind, id, markdown: "## New section\n\nContent here." };
    case "image":    return { kind, id, src: "" };
    case "cta":      return { kind, id, title: "Ready to switch?", buttonLabel: "Get Free Quote", buttonHref: "/#consultation" };
  }
}

/* ============================================================
   COMPONENT
   ============================================================ */
const DEFAULT_PAGE: Partial<PageRecord> = {
  title: "",
  slug: "",
  status: "draft",
  sections: [],
};

export default function PageEditorView() {
  const nav = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const pagesQ = useCmsCollection<PageRecord>("pages");
  const guard  = useDirtyGuard();

  const existing = useMemo(() => pagesQ.data.find((p) => p.id === id), [pagesQ.data, id]);
  const [draft, setDraft]   = useState<Partial<PageRecord>>(DEFAULT_PAGE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) { setDraft(DEFAULT_PAGE); guard.markClean(); return; }
    if (existing) { setDraft(existing); guard.markClean(); }
  }, [isNew, existing]); // eslint-disable-line react-hooks/exhaustive-deps

  const metaSchema = useMemo(() => buildMetaSchema(
    () => pagesQ.data.filter((p) => p.id !== draft.id).map((p) => p.slug)
  ), [pagesQ.data, draft.id]);

  function update(next: Partial<PageRecord>) {
    setDraft(next); guard.markDirty();
  }

  function updateBlock(idx: number, value: Record<string, any>) {
    const next = (draft.sections ?? []).slice();
    next[idx] = { ...next[idx], ...value } as PageSectionBlock;
    update({ ...draft, sections: next });
  }
  function addBlock(kind: PageSectionBlock["kind"]) {
    const next = [...(draft.sections ?? []), newBlock(kind)];
    update({ ...draft, sections: next });
  }
  function removeBlock(idx: number) {
    const next = (draft.sections ?? []).filter((_, i) => i !== idx);
    update({ ...draft, sections: next });
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    const arr = (draft.sections ?? []).slice();
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    update({ ...draft, sections: arr });
  }

  async function onSave() {
    const next: Partial<PageRecord> = { ...draft };
    if (!next.slug && next.title) {
      next.slug = uniqueSlug(next.title, pagesQ.data.filter((p) => p.id !== next.id).map((p) => p.slug));
    }
    if (next.status === "published" && !next.publishedAt) next.publishedAt = toIso(new Date());

    const validation = validateSchema(metaSchema, next as any);
    setErrors(validation);
    if (hasErrors(validation)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    if (isNew) {
      const res = await pagesQ.create(next as Omit<PageRecord, "id">);
      setSaving(false);
      if (res.ok) { toast.success("Page created."); guard.markClean(); nav("/admin/pages-builder", { replace: true }); }
      else toast.error(res.error || "Save failed");
    } else {
      const res = await pagesQ.update(id!, next);
      setSaving(false);
      if (res.ok) { toast.success("Page updated."); guard.markClean(); }
      else toast.error(res.error || "Save failed");
    }
  }

  return (
    <>
      <AdminPageHeader
        title={isNew ? "New Page" : draft.title || "Edit Page"}
        subtitle={`Slug: /p/${draft.slug || "—"} · ${(draft.sections?.length ?? 0)} blocks`}
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="ghost" onClick={() => nav("/admin/pages-builder")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </AdminButton>
            <AdminButton onClick={onSave} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving…" : isNew ? "Create Page" : guard.dirty ? "Save Changes" : "Saved"}
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard className="lg:col-span-1">
          <h3 className="font-bold text-ink-900 mb-3">Page Metadata</h3>
          <FormRenderer
            schema={metaSchema}
            value={draft as Record<string, any>}
            errors={errors}
            onChange={(next) => update(next as Partial<PageRecord>)}
            onDirty={() => guard.markDirty()}
          />
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink-900">Sections</h3>
            <div className="flex items-center gap-1.5">
              {(Object.keys(blockSchemas) as PageSectionBlock["kind"][]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => addBlock(k)}
                  className="text-[11px] font-bold rounded-lg border border-gray-200 px-2.5 py-1.5 hover:border-brand-400 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> {blockLabels[k]}
                </button>
              ))}
            </div>
          </div>

          {(draft.sections ?? []).length === 0 && (
            <p className="text-sm text-gray-500 italic">No blocks yet — add one above.</p>
          )}

          <ul className="space-y-4">
            {(draft.sections ?? []).map((block, idx) => (
              <BlockEditor
                key={block.id}
                idx={idx}
                total={(draft.sections ?? []).length}
                block={block}
                onChange={(v) => updateBlock(idx, v)}
                onRemove={() => removeBlock(idx)}
                onMoveUp={() => moveBlock(idx, -1)}
                onMoveDown={() => moveBlock(idx, 1)}
              />
            ))}
          </ul>
        </AdminCard>
      </div>
    </>
  );
}

function BlockEditor({
  block, idx, total, onChange, onRemove, onMoveUp, onMoveDown,
}: {
  block: PageSectionBlock;
  idx: number; total: number;
  onChange: (v: Record<string, any>) => void;
  onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  const [open, setOpen] = useState(true);
  const schema = blockSchemas[block.kind];

  return (
    <li className="rounded-xl border border-gray-200 bg-paper/40">
      <div className="flex items-center gap-2 px-3 py-2">
        <button type="button" onClick={() => setOpen(!open)} className="flex-1 text-left text-sm font-bold text-ink-900">
          {idx + 1}. {blockLabels[block.kind]}
          <span className="ml-2 text-xs text-gray-500 font-normal">{(block as any).title || (block as any).markdown?.slice(0, 30) || ""}</span>
        </button>
        <button type="button" onClick={onMoveUp}   disabled={idx === 0}         className="text-xs px-1.5 text-gray-500 hover:text-ink-900 disabled:opacity-30">↑</button>
        <button type="button" onClick={onMoveDown} disabled={idx === total - 1} className="text-xs px-1.5 text-gray-500 hover:text-ink-900 disabled:opacity-30">↓</button>
        <button type="button" onClick={onRemove} className="text-xs px-1.5 text-rose-500 hover:text-rose-700">Delete</button>
      </div>
      {open && (
        <div className="px-4 py-3 border-t border-gray-100">
          <FormRenderer
            schema={schema}
            value={block as Record<string, any>}
            onChange={(v) => onChange(v)}
          />
        </div>
      )}
    </li>
  );
}
