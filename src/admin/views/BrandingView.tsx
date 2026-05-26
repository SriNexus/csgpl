/**
 * BrandingView — single source of truth for every logo / icon slot.
 *
 * Persists to the `branding` singleton:
 *   • logoLight     — primary brand logo (Navbar, Admin sidebar)
 *   • logoDark      — dark-background variant (Footer)
 *   • logoCollapsed — icon-only logo for compact surfaces
 *   • favicon       — browser tab icon (synced to <link rel="icon">)
 *   • appleTouchIcon (optional)
 *   • ogImage       (optional, default Open Graph share image)
 *
 * Every slot upload uses the same MediaUploader → cmsStorage pipeline as the
 * rest of the admin — so files land in Firebase Storage AND the `media`
 * collection AND can be re-picked from the Media Library.
 */

import { useEffect, useState } from "react";
import { Save, Trash2, Library } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminButton, AdminInput,
  MediaUploader, MediaPickerModal,
} from "@/admin/components";
import { useCmsDocument, type BrandingDoc } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";

type Slot = keyof BrandingDoc;

interface SlotConfig {
  key: Slot;
  title: string;
  desc: string;
  preview: "logo" | "icon" | "og";
}

const SLOTS: SlotConfig[] = [
  {
    key: "logoLight",
    title: "Primary Logo (Light Backgrounds)",
    desc: "Used in the navbar and admin sidebar. PNG with transparency or SVG recommended.",
    preview: "logo",
  },
  {
    key: "logoDark",
    title: "Dark-Background Logo",
    desc: "Used in the footer and dark hero sections. Falls back to primary if empty.",
    preview: "logo",
  },
  {
    key: "logoCollapsed",
    title: "Collapsed / Icon Logo",
    desc: "Compact variant for mobile navbars & collapsed admin sidebars. Roughly square.",
    preview: "icon",
  },
  {
    key: "favicon",
    title: "Favicon",
    desc: "Browser tab icon. Square 32×32 or 64×64 PNG / SVG / ICO recommended.",
    preview: "icon",
  },
  {
    key: "appleTouchIcon",
    title: "Apple Touch Icon",
    desc: "iOS home-screen icon. Recommended 180×180 PNG.",
    preview: "icon",
  },
  {
    key: "ogImage",
    title: "Default OG / Share Image",
    desc: "Used as the default Open Graph share preview. Recommended 1200×630.",
    preview: "og",
  },
];

export default function BrandingView() {
  const { data, save, source } = useCmsDocument("branding");
  const [draft, setDraft] = useState<BrandingDoc>(data);
  const [saving, setSaving] = useState(false);
  const guard = useDirtyGuard();

  useEffect(() => { setDraft(data); }, [data]);

  /**
   * Update a single slot. Auto-saves immediately so the new logo/favicon
   * reflects across the site without an extra "Publish" click.
   * Uses `useCmsDocument.save` which is itself optimistic + fire-and-forget,
   * so the call returns in microseconds.
   */
  async function update(slot: Slot, url: string, autoSave = true) {
    const next = { ...draft, [slot]: url };
    setDraft(next);
    if (!autoSave) {
      guard.markDirty();
      return;
    }
    // Fire-and-forget save (optimistic — UI already reflects via local cache)
    const res = await save(next);
    if (res.ok) {
      guard.markClean();
      // No toast on auto-save — would be too noisy. The slot preview is the feedback.
    } else {
      // On failure, surface it loudly so the admin knows to retry manually
      toast.error(res.error || "Failed to save branding");
      guard.markDirty();
    }
  }

  async function onSave() {
    setSaving(true);
    const res = await save(draft);
    setSaving(false);
    if (res.ok) {
      toast.success("Branding published.");
      guard.markClean();
    } else {
      toast.error(res.error || "Failed to save branding");
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Branding"
        subtitle="Upload your logos, favicon & share image — applied site-wide"
        source={source}
        action={
          <AdminButton onClick={onSave} disabled={saving || !guard.dirty}>
            <Save className="h-4 w-4" /> {saving ? "Saving…" : guard.dirty ? "Publish Changes" : "Saved"}
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SLOTS.map((slot) => (
          <BrandingSlot
            key={slot.key}
            cfg={slot}
            value={draft[slot.key] || ""}
            onChange={(url) => update(slot.key, url)}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SLOT EDITOR — uploader + library picker + manual URL + preview
   ============================================================ */

function BrandingSlot({
  cfg, value, onChange,
}: {
  cfg: SlotConfig;
  value: string;
  /** Called for committed URLs that should be persisted. */
  onChange: (url: string) => void;
}) {
  // Local-only preview URL during the upload window.
  // This is rendered in the preview tile but never persisted to the CMS.
  const [previewBlob, setPreviewBlob] = useState<string | null>(null);

  const displayed = previewBlob || value;
  const [picking, setPicking] = useState(false);

  const previewClass =
    cfg.preview === "icon" ? "h-16 w-16 rounded-2xl bg-white border border-gray-200 grid place-items-center overflow-hidden" :
    cfg.preview === "og"   ? "aspect-[1200/630] w-full max-w-md rounded-xl bg-gray-50 border border-gray-200 grid place-items-center overflow-hidden" :
                             "h-16 w-auto px-4 py-2 rounded-2xl bg-white border border-gray-200 grid place-items-center overflow-hidden";

  const imgClass = cfg.preview === "og" ? "h-full w-full object-cover" : "h-full w-auto object-contain";

  return (
    <AdminCard>
      <div className="mb-4">
        <h3 className="font-bold text-ink-900">{cfg.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 max-w-md">{cfg.desc}</p>
        <code className="mt-2 inline-block text-[10px] font-mono text-ink-500 bg-paper px-2 py-0.5 rounded">branding.{String(cfg.key)}</code>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="space-y-3">
          <MediaUploader
            folder="branding"
            onPreview={(blobUrl) => setPreviewBlob(blobUrl)}
            onUploaded={(url) => { setPreviewBlob(null); onChange(url); }}
            hint="PNG · JPG · WEBP · SVG · ICO — up to 15 MB"
          />
          <div className="flex items-stretch gap-2">
            <AdminInput
              value={value}
              onChange={(e) => { setPreviewBlob(null); onChange(e.target.value); }}
              placeholder="Paste image URL"
            />
            <AdminButton type="button" size="sm" variant="ghost" onClick={() => setPicking(true)}>
              <Library className="h-3.5 w-3.5" /> Library
            </AdminButton>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className={previewClass}>
            {displayed
              ? <img src={displayed} alt={`${cfg.title} preview`} className={imgClass}
                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }} />
              : <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No image</span>}
          </div>
          {value && (
            <button
              type="button"
              onClick={() => { setPreviewBlob(null); onChange(""); }}
              className="text-[11px] inline-flex items-center gap-1 text-rose-600 hover:underline"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <MediaPickerModal
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(url) => onChange(url)}
        uploadFolder="branding"
        folder="branding"
      />
    </AdminCard>
  );
}
