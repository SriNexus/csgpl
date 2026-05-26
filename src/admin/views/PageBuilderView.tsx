/**
 * PageBuilderView — visual page composer.
 *
 * Edits two CMS singletons:
 *   • homepageLayout — section order + visibility (drag-and-drop)
 *   • hero           — hero text content (with live preview)
 *
 * Uses native HTML5 drag-and-drop (no extra dependency).
 */

import { useEffect, useState } from "react";
import { GripVertical, Plus, RotateCcw, Save } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton, AdminField, AdminInput, AdminTextarea,
} from "@/admin/components";
import { useCmsDocument } from "@/cms";
import { DEFAULT_HOMEPAGE_LAYOUT, HOME_SECTION_IDS, type HomeSectionConfig, type HomeSectionId } from "@/cms";
import { sectionLabels } from "@/containers/sectionRegistry";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";

export default function PageBuilderView() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Page Builder" subtitle="Reorder & toggle homepage sections + edit hero copy" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LayoutEditor />
        <HeroEditor />
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT EDITOR — drag & drop section ordering
   ============================================================ */

function LayoutEditor() {
  const { data, save, source } = useCmsDocument("homepageLayout");
  const [sections, setSections] = useState<HomeSectionConfig[]>(data.sections);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<HomeSectionId | null>(null);
  const guard = useDirtyGuard();

  // Re-sync when CMS hydrates
  useEffect(() => {
    // Ensure every known id is present (forward-compat when registry grows)
    const presentIds = new Set(data.sections.map((s) => s.id));
    const merged: HomeSectionConfig[] = [
      ...data.sections,
      ...HOME_SECTION_IDS
        .filter((id) => !presentIds.has(id))
        .map((id, i) => ({ id, enabled: true, order: data.sections.length + i + 1 })),
    ].sort((a, b) => a.order - b.order);
    setSections(merged);
  }, [data]);

  function onDragStart(id: HomeSectionId) { setDragId(id); }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(targetId: HomeSectionId) {
    if (!dragId || dragId === targetId) return;
    const next = [...sections];
    const fromIdx = next.findIndex((s) => s.id === dragId);
    const toIdx   = next.findIndex((s) => s.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSections(next.map((s, i) => ({ ...s, order: i + 1 })));
    setDragId(null);
    guard.markDirty();
  }

  function toggle(id: HomeSectionId) {
    setSections((cur) => cur.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    guard.markDirty();
  }

  async function onSave() {
    setSaving(true);
    const res = await save({ sections });
    setSaving(false);
    if (res.ok) { toast.success("Layout published."); guard.markClean(); }
    else toast.error(res.error || "Failed to save layout");
  }

  async function onReset() {
    setSections(DEFAULT_HOMEPAGE_LAYOUT.sections.slice());
    guard.markDirty();
    toast.info("Reset to default order. Click Publish to save.");
  }

  return (
    <AdminCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-ink-900">Homepage Sections</h3>
        <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${source === "firestore" ? "bg-emerald-50 text-emerald-700" : source === "local" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
          {source}
        </span>
      </div>

      <ul className="space-y-2">
        {sections.map((s) => (
          <li
            key={s.id}
            draggable
            onDragStart={() => onDragStart(s.id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(s.id)}
            onDragEnd={() => setDragId(null)}
            className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition ${dragId === s.id ? "border-brand-400 shadow-soft" : "border-gray-100 hover:border-brand-200"}`}
          >
            <span className="text-gray-300 cursor-grab active:cursor-grabbing"><GripVertical className="h-4 w-4" /></span>
            <span className="text-sm font-semibold text-ink-800 flex-1">{sectionLabels[s.id] ?? s.id}</span>
            <button
              type="button"
              onClick={() => toggle(s.id)}
              className={`text-[10px] font-bold rounded-full px-2 py-0.5 transition ${s.enabled ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
            >
              {s.enabled ? "ON" : "OFF"}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-2">
        <AdminButton onClick={onSave} disabled={saving || !guard.dirty} size="sm">
          <Save className="h-4 w-4" /> {saving ? "Publishing…" : guard.dirty ? "Publish Changes" : "Saved"}
        </AdminButton>
        <AdminButton variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </AdminButton>
        <AdminButton variant="subtle" size="sm" className="ml-auto" disabled>
          <Plus className="h-4 w-4" /> Add Section
        </AdminButton>
      </div>
    </AdminCard>
  );
}

/* ============================================================
   HERO EDITOR — singleton document editor with live preview
   ============================================================ */

function HeroEditor() {
  const { data, save, source } = useCmsDocument("hero");

  const [line1,    setLine1]    = useState<string>(data.headlineParts.line1);
  const [serif,    setSerif]    = useState<string>(data.headlineParts.serif);
  const [gradient, setGradient] = useState<string>(data.headlineParts.gradient);
  const [desc,     setDesc]     = useState<string>(data.description);
  const [badge,    setBadge]    = useState<string>(data.badge);
  const [saving,   setSaving]   = useState(false);
  const guard = useDirtyGuard();

  useEffect(() => {
    setLine1(data.headlineParts.line1);
    setSerif(data.headlineParts.serif);
    setGradient(data.headlineParts.gradient);
    setDesc(data.description);
    setBadge(data.badge);
  }, [data]);

  function mark<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); guard.markDirty(); };
  }

  async function onSave() {
    setSaving(true);
    const next = { ...data, badge, description: desc, headlineParts: { line1, serif, gradient } };
    const res = await save(next as any);
    setSaving(false);
    if (res.ok) { toast.success("Hero published."); guard.markClean(); }
    else toast.error(res.error || "Failed to save hero");
  }

  return (
    <AdminCard className="lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-ink-900">Edit Hero Section</h3>
        <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${source === "firestore" ? "bg-emerald-50 text-emerald-700" : source === "local" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
          {source}
        </span>
      </div>

      <div className="space-y-4">
        <AdminField label="Badge text">
          <AdminInput value={badge} onChange={(e) => mark(setBadge)(e.target.value)} />
        </AdminField>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AdminField label="Headline line">
            <AdminInput value={line1} onChange={(e) => mark(setLine1)(e.target.value)} />
          </AdminField>
          <AdminField label="Serif accent">
            <AdminInput value={serif} onChange={(e) => mark(setSerif)(e.target.value)} />
          </AdminField>
          <AdminField label="Gradient end">
            <AdminInput value={gradient} onChange={(e) => mark(setGradient)(e.target.value)} />
          </AdminField>
        </div>
        <AdminField label="Description">
          <AdminTextarea rows={3} value={desc} onChange={(e) => mark(setDesc)(e.target.value)} />
        </AdminField>
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 p-6 border border-gray-100">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Live Preview</div>
        <h4 className="text-2xl font-extrabold text-ink-900 leading-tight">
          {line1} with <span className="serif font-normal text-brand-700">{serif}</span>{" "}
          <span className="text-gradient-brand">{gradient}</span>
        </h4>
        <p className="text-gray-600 mt-3 text-sm">{desc}</p>
      </div>

      <div className="mt-5">
        <AdminButton onClick={onSave} disabled={saving || !guard.dirty}>
          <Save className="h-4 w-4" /> {saving ? "Publishing…" : guard.dirty ? "Publish Changes" : "Saved"}
        </AdminButton>
      </div>
    </AdminCard>
  );
}
