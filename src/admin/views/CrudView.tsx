/**
 * CrudView — generic CRUD page powered by `useCmsCollection`.
 *
 * Field types:
 *   • text       (default)
 *   • textarea
 *   • number
 *   • image      → MediaUploader + manual URL fallback + preview
 *
 * Adds:
 *   • dirty-state protection
 *   • toast feedback
 *   • disabled submit while saving
 */

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import {
  AdminPageHeader, AdminTable, AdminModal, ConfirmDialog,
  AdminButton, AdminField, AdminInput, AdminTextarea, MediaUploader,
  type AdminTableColumn,
} from "@/admin/components";
import { useCmsCollection } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";
import { resolveMedia } from "@/cms/media";
import type { CmsRecord } from "@/cms/types";
import type { CollectionKey } from "@/cms";

export type CrudFieldType = "text" | "textarea" | "number" | "image";

export interface CrudField {
  key: string;
  label: string;
  type?: CrudFieldType;
  placeholder?: string;
  required?: boolean;
}

export interface CrudViewProps<T extends CmsRecord> {
  title: string;
  subtitle?: string;
  collectionKey: CollectionKey;
  columns: AdminTableColumn<T>[];
  fields: CrudField[];
  singular: string;
}

export default function CrudView<T extends CmsRecord>({
  title, subtitle, collectionKey, columns, fields, singular,
}: CrudViewProps<T>) {
  const { data, loading, source, create, update, remove } = useCmsCollection<T>(collectionKey);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const guard = useDirtyGuard();

  function startNew() { setEditing({} as Partial<T>); guard.markClean(); }
  function startEdit(row: T) { setEditing({ ...row }); guard.markClean(); }
  function setField(key: string, value: any) {
    setEditing((cur) => ({ ...(cur || {}), [key]: value } as Partial<T>));
    guard.markDirty();
  }

  function closeModal() {
    if (guard.dirty && !confirm("Discard unsaved changes?")) return;
    setEditing(null);
    guard.markClean();
  }

  async function onSave() {
    if (!editing) return;
    for (const f of fields) {
      if (f.required && !(editing as any)[f.key]) {
        toast.error(`Please fill: ${f.label}`);
        return;
      }
    }
    setSaving(true);
    const res = editing.id
      ? await update(editing.id as any, editing as Partial<T>)
      : await create(editing as Omit<T, "id">);
    setSaving(false);
    if (res.ok) {
      toast.success(`${singular} ${editing.id ? "updated" : "created"}.`);
      guard.markClean();
      setEditing(null);
    } else {
      toast.error(res.error || "Save failed");
    }
  }

  async function onConfirmDelete() {
    if (!confirmId) return;
    const res = await remove(confirmId as any);
    setConfirmId(null);
    if (res.ok) toast.success(`${singular} deleted.`);
    else toast.error(res.error || "Delete failed");
  }

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        source={source}
        action={
          <AdminButton onClick={startNew}>
            <Plus className="h-4 w-4" /> New {singular}
          </AdminButton>
        }
      />

      <AdminTable<T>
        rows={data}
        columns={columns}
        onEdit={startEdit}
        onDelete={(r) => setConfirmId(String(r.id))}
        emptyTitle={`No ${title.toLowerCase()} yet`}
        emptySubtitle={loading ? "Loading…" : `Click "New ${singular}" to add your first entry.`}
      />

      <AdminModal
        open={!!editing}
        title={`${editing?.id ? "Edit" : "Add"} ${singular}`}
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <AdminButton variant="ghost" onClick={closeModal} disabled={saving}>Cancel</AdminButton>
            <AdminButton onClick={onSave} disabled={saving || (!guard.dirty && !!editing?.id)}>
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : guard.dirty ? "Save Changes" : "Save"}
            </AdminButton>
          </>
        }
      >
        {editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={(f.type === "textarea" || f.type === "image") ? "sm:col-span-2" : ""}>
                <CrudFieldRenderer
                  field={f}
                  value={(editing as any)[f.key]}
                  onChange={(v) => setField(f.key, v)}
                />
              </div>
            ))}
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!confirmId}
        title={`Delete ${singular.toLowerCase()}?`}
        message="This action cannot be undone. The record will be permanently removed."
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

/* ============================================================
   FIELD RENDERER — split per type so adding a new type stays cheap.
   ============================================================ */

function CrudFieldRenderer({
  field, value, onChange,
}: { field: CrudField; value: any; onChange: (v: any) => void }) {
  const label = field.label + (field.required ? " *" : "");

  if (field.type === "textarea") {
    return (
      <AdminField label={label}>
        <AdminTextarea
          rows={4}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </AdminField>
    );
  }

  if (field.type === "image") {
    return (
      <AdminField label={label}>
        <ImageFieldEditor value={value ?? ""} onChange={onChange} placeholder={field.placeholder} />
      </AdminField>
    );
  }

  if (field.type === "number") {
    return (
      <AdminField label={label}>
        <AdminInput
          type="number"
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </AdminField>
    );
  }

  return (
    <AdminField label={label}>
      <AdminInput
        type="text"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </AdminField>
  );
}

/* ============================================================
   IMAGE FIELD — uploader + manual URL + preview
   Reusable — single source of truth for image input UX.
   ============================================================ */

function ImageFieldEditor({
  value, onChange, placeholder,
}: { value: string; onChange: (url: string) => void; placeholder?: string }) {
  // Persisted URL (what gets saved)
  const [url, setUrl] = useState<string>(value);
  // Local-only blob preview during upload — never persisted
  const [previewBlob, setPreviewBlob] = useState<string | null>(null);

  useEffect(() => { setUrl(value); }, [value]);

  function commit(next: string) {
    setPreviewBlob(null);
    setUrl(next);
    onChange(next);
  }

  const displayed = previewBlob || url;
  const isUploading = !!previewBlob;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 items-start">
      <div className="space-y-3">
        <MediaUploader
          folder="cms"
          onPreview={(blobUrl) => setPreviewBlob(blobUrl)}
          onUploaded={(uploadedUrl) => commit(uploadedUrl)}
        />
        <AdminInput
          type="text"
          placeholder={placeholder || "Or paste image URL"}
          value={url}
          onChange={(e) => commit(e.target.value)}
        />
        {isUploading && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            Uploading… don't save yet — your image will be saved once the upload completes.
          </p>
        )}
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 aspect-square overflow-hidden grid place-items-center">
        {displayed ? (
          <img
            src={resolveMedia(displayed)}
            alt="preview"
            className="h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }}
          />
        ) : (
          <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">No image</span>
        )}
      </div>
    </div>
  );
}
