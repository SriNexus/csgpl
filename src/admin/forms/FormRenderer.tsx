/**
 * FormRenderer — schema-driven form engine.
 *
 *   <FormRenderer
 *     schema={blogSchema}
 *     value={draft}
 *     errors={errors}
 *     onChange={setDraft}
 *   />
 *
 * The renderer is presentation-only — validation, dirty tracking & submission
 * live in the parent (BlogEditorView etc.) so behaviour stays explicit.
 */

import { useState } from "react";
import { ChevronDown, GripVertical, Library, Plus, Trash2 } from "lucide-react";
import {
  AdminField, AdminInput, AdminTextarea, AdminSelect, MediaUploader, AdminButton, MediaPickerModal,
} from "@/admin/components";
import { resolveMedia } from "@/cms/media";
import { slugify, uniqueSlug } from "@/utils/content";
import type { Field, FormSchema, ImageField, RepeaterField, SelectField, SlugField, GroupField, BaseField } from "./types";

export type FormErrors = Record<string, string | undefined>;

export interface FormRendererProps {
  schema: FormSchema;
  value: Record<string, any>;
  errors?: FormErrors;
  onChange: (next: Record<string, any>) => void;
  /** Fires for any field change so callers can flag dirty state. */
  onDirty?: () => void;
}

export default function FormRenderer({ schema, value, errors, onChange, onDirty }: FormRendererProps) {
  function setField(key: string, v: any) {
    onChange({ ...value, [key]: v });
    onDirty?.();
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {schema.map((field) => (
        <FieldHost
          key={field.key}
          field={field}
          value={value}
          errors={errors}
          setField={setField}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FIELD HOST — routes each field by type
   ============================================================ */
function FieldHost({
  field, value, errors, setField,
}: { field: Field; value: Record<string, any>; errors?: FormErrors; setField: (k: string, v: any) => void }) {
  // Visibility gate
  if ("visibleWhen" in field && field.visibleWhen && !field.visibleWhen(value)) return null;

  const span = (field as any).span === 2 ? "sm:col-span-2" : "";
  const error = errors?.[field.key];

  if (field.type === "group")     return <div className={span}><GroupRenderer field={field as GroupField} value={value} errors={errors} setField={setField} /></div>;
  if (field.type === "repeater")  return <div className={span}><RepeaterRenderer field={field as RepeaterField} value={value[field.key] ?? []} setField={(v) => setField(field.key, v)} /></div>;
  if (field.type === "image")     return <div className={span}><ImageRenderer field={field as ImageField} value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "slug")      return <div className={span}><SlugRenderer field={field as SlugField} value={value[field.key] ?? ""} source={value[(field as SlugField).sourceKey]} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "select")    return <div className={span}><SelectRenderer field={field as SelectField} value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "boolean")   return <div className={span}><BooleanRenderer field={field as BaseField} value={value[field.key] ?? false} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "markdown")  return <div className={span}><TextareaRenderer field={field as BaseField} rows={14} mono value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "textarea")  return <div className={span}><TextareaRenderer field={field as BaseField} rows={4} value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "tags")      return <div className={span}><TagsRenderer field={field as BaseField} value={value[field.key] ?? []} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "number")    return <div className={span}><TextRenderer field={field as BaseField} type="number" value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v === "" ? "" : Number(v))} /></div>;
  if (field.type === "url")       return <div className={span}><TextRenderer field={field as BaseField} type="url" value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
  if (field.type === "date")      return <div className={span}><TextRenderer field={field as BaseField} type="date" value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;

  return <div className={span}><TextRenderer field={field as BaseField} value={value[field.key] ?? ""} error={error} onChange={(v) => setField(field.key, v)} /></div>;
}

/* ============================================================
   FIELD RENDERERS
   ============================================================ */

function label(f: BaseField | SelectField | SlugField | ImageField) {
  return f.label + (("required" in f && f.required) ? " *" : "");
}

function TextRenderer({
  field, value, error, onChange, type = "text",
}: { field: BaseField; value: any; error?: string; onChange: (v: any) => void; type?: string }) {
  return (
    <AdminField label={label(field)} hint={field.hint} error={error}>
      <AdminInput
        type={type}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </AdminField>
  );
}

function TextareaRenderer({
  field, value, rows, mono, error, onChange,
}: { field: BaseField; value: string; rows: number; mono?: boolean; error?: string; onChange: (v: string) => void }) {
  return (
    <AdminField label={label(field)} hint={field.hint} error={error}>
      <AdminTextarea
        rows={rows}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={mono ? "font-mono text-[13px] leading-relaxed" : ""}
      />
    </AdminField>
  );
}

function SelectRenderer({
  field, value, error, onChange,
}: { field: SelectField; value: string; error?: string; onChange: (v: string) => void }) {
  return (
    <AdminField label={label(field)} hint={field.hint} error={error}>
      <AdminSelect value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </AdminSelect>
    </AdminField>
  );
}

function BooleanRenderer({
  field, value, onChange,
}: { field: BaseField; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 hover:border-brand-300">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
      />
      <span>
        <span className="block text-sm font-bold text-ink-900">{field.label}</span>
        {field.hint && <span className="block text-[11px] text-gray-500 mt-0.5">{field.hint}</span>}
      </span>
    </label>
  );
}

function TagsRenderer({
  field, value, error, onChange,
}: { field: BaseField; value: string[]; error?: string; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState<string>(Array.isArray(value) ? value.join(", ") : "");
  function commit(next: string) {
    setDraft(next);
    onChange(next.split(",").map((t) => t.trim()).filter(Boolean));
  }
  return (
    <AdminField label={label(field)} hint={field.hint || "Comma-separated values"} error={error}>
      <AdminInput
        type="text"
        placeholder={field.placeholder || "subsidy, residential, …"}
        value={draft}
        onChange={(e) => commit(e.target.value)}
      />
    </AdminField>
  );
}

function SlugRenderer({
  field, value, source, error, onChange,
}: { field: SlugField; value: string; source: any; error?: string; onChange: (v: string) => void }) {
  const [touched, setTouched] = useState<boolean>(!!value);

  // Auto-generate from source when slug is empty / untouched
  function onAutogen() {
    const existing = field.existing ? field.existing() : [];
    const next = uniqueSlug(String(source || "post"), existing);
    onChange(next);
    setTouched(true);
  }

  return (
    <AdminField label={label(field)} hint={field.hint || "URL-friendly identifier"} error={error}>
      <div className="flex items-stretch gap-2">
        <AdminInput
          value={value ?? ""}
          onChange={(e) => { setTouched(true); onChange(slugify(e.target.value)); }}
          placeholder={field.placeholder || "auto-generated"}
        />
        <button
          type="button"
          onClick={onAutogen}
          className="shrink-0 rounded-xl border border-gray-200 px-3 text-[11px] font-bold uppercase tracking-wider text-ink-700 hover:bg-paper"
          title={touched ? "Re-generate from title" : "Generate slug from title"}
        >
          Auto
        </button>
      </div>
    </AdminField>
  );
}

function ImageRenderer({
  field, value, error, onChange,
}: { field: ImageField; value: string; error?: string; onChange: (v: string) => void }) {
  const [picking, setPicking] = useState(false);
  // Local-only blob preview during upload — never persisted to the draft.
  const [previewBlob, setPreviewBlob] = useState<string | null>(null);
  const displayed = previewBlob || value;
  const isBlob = !!previewBlob;
  return (
    <AdminField label={label(field)} hint={field.hint} error={error}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 items-start">
        <div className="space-y-3">
          <MediaUploader
            folder={field.folder ?? "uploads"}
            onPreview={(blobUrl) => setPreviewBlob(blobUrl)}
            onUploaded={(url) => { setPreviewBlob(null); onChange(url); }}
          />
          <div className="flex items-center gap-2">
            <AdminInput
              type="text"
              placeholder={field.placeholder || "Or paste image URL"}
              value={value ?? ""}
              onChange={(e) => { setPreviewBlob(null); onChange(e.target.value); }}
            />
            <AdminButton type="button" size="sm" variant="ghost" onClick={() => setPicking(true)}>
              <Library className="h-3.5 w-3.5" /> Library
            </AdminButton>
          </div>
          {isBlob && (
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

      <MediaPickerModal
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(url) => { setPreviewBlob(null); onChange(url); }}
        uploadFolder={field.folder ?? "uploads"}
      />
    </AdminField>
  );
}

/* ============================================================
   GROUP RENDERER — visual section header + nested fields
   ============================================================ */
function GroupRenderer({
  field, value, errors, setField,
}: { field: GroupField; value: Record<string, any>; errors?: FormErrors; setField: (k: string, v: any) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="sm:col-span-2 rounded-2xl border border-gray-100 bg-gray-50/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="text-left">
          <div className="text-sm font-bold text-ink-900">{field.label}</div>
          {field.description && <div className="text-[11px] text-gray-500 mt-0.5">{field.description}</div>}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field.fields.map((sub) => (
              <FieldHost key={sub.key} field={sub} value={value} errors={errors} setField={setField} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   REPEATER RENDERER — ordered array of sub-records
   ============================================================ */
function RepeaterRenderer({
  field, value, setField,
}: { field: RepeaterField; value: Array<Record<string, any>>; setField: (v: any[]) => void }) {
  const items = Array.isArray(value) ? value : [];

  function update(idx: number, item: Record<string, any>) {
    const next = items.slice(); next[idx] = item; setField(next);
  }
  function remove(idx: number) {
    if (field.min !== undefined && items.length <= field.min) return;
    setField(items.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    setField(next);
  }
  function add() {
    if (field.max !== undefined && items.length >= field.max) return;
    setField([...items, field.newItem ? field.newItem() : {}]);
  }

  return (
    <div className="sm:col-span-2 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-bold text-ink-900">{field.label}</div>
          {field.hint && <div className="text-[11px] text-gray-500 mt-0.5">{field.hint}</div>}
        </div>
        <AdminButton size="sm" variant="ghost" onClick={add} disabled={field.max !== undefined && items.length >= field.max}>
          <Plus className="h-3.5 w-3.5" /> Add
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No items yet — click Add.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <RepeaterRow
              key={idx}
              idx={idx}
              total={items.length}
              label={field.itemLabel ? field.itemLabel(item, idx) : `Item ${idx + 1}`}
              schema={field.itemSchema}
              value={item}
              onChange={(v) => update(idx, v)}
              onMoveUp={() => move(idx, -1)}
              onMoveDown={() => move(idx, 1)}
              onRemove={() => remove(idx)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function RepeaterRow({
  idx, total, label, schema, value, onChange, onMoveUp, onMoveDown, onRemove,
}: {
  idx: number; total: number;
  label: React.ReactNode;
  schema: Field[];
  value: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
  onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  function set(key: string, v: any) { onChange({ ...value, [key]: v }); }

  return (
    <li className="rounded-xl border border-gray-200 bg-paper/60">
      <div className="flex items-center gap-2 px-3 py-2">
        <GripVertical className="h-4 w-4 text-gray-300" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 text-left text-sm font-semibold text-ink-900 truncate"
        >
          {label}
        </button>
        <button type="button" onClick={onMoveUp}   disabled={idx === 0}         className="text-xs px-1.5 text-gray-500 hover:text-ink-900 disabled:opacity-30">↑</button>
        <button type="button" onClick={onMoveDown} disabled={idx === total - 1} className="text-xs px-1.5 text-gray-500 hover:text-ink-900 disabled:opacity-30">↓</button>
        <button type="button" onClick={onRemove} className="text-xs px-1.5 text-rose-500 hover:text-rose-700"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
      {open && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schema.map((f) => (
              <FieldHost key={f.key} field={f} value={value} setField={set} />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
