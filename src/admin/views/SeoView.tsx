import { useEffect, useState } from "react";
import { Save, Settings2, Download, RefreshCw } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminField, AdminInput, AdminTextarea, AdminButton,
} from "@/admin/components";
import { useCmsDocument, type SiteDocKey } from "@/cms";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";
import { sitemap } from "@/cms/services/sitemap";

/**
 * SeoView — page-by-page meta editor.
 * Persists each page's SEO into its own singleton document (e.g. `seoHome`).
 */

const PAGES: { key: Extract<SiteDocKey, `seo${string}`>; label: string }[] = [
  { key: "seoHome",     label: "Home" },
  { key: "seoAbout",    label: "About Us" },
  { key: "seoProducts", label: "Products" },
  { key: "seoBlog",     label: "Blog" },
  { key: "seoContact",  label: "Contact" },
];

export default function SeoView() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO Settings"
        subtitle="Page metadata, OG images, canonical URLs & sitemap tools"
      />
      <SeoTools />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PAGES.map((p) => <SeoEditor key={p.key} docKey={p.key} label={p.label} />)}
      </div>
    </div>
  );
}

/* ============================================================
   Sitemap + robots.txt generators
   ============================================================ */
function SeoTools() {
  const [busy, setBusy] = useState<"sitemap" | "robots" | null>(null);

  function download(filename: string, mime: string, content: string) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function genSitemap() {
    setBusy("sitemap");
    try {
      const xml = await sitemap.buildXml();
      download("sitemap.xml", "application/xml", xml);
      toast.success("sitemap.xml generated.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to build sitemap");
    } finally { setBusy(null); }
  }

  function genRobots() {
    setBusy("robots");
    try {
      download("robots.txt", "text/plain", sitemap.buildRobots());
      toast.success("robots.txt generated.");
    } finally { setBusy(null); }
  }

  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-ink-900">Search Engine Tools</h3>
          <p className="text-sm text-gray-500 mt-1">
            Generate <code className="font-mono bg-paper px-1 rounded">sitemap.xml</code> &amp;
            <code className="font-mono bg-paper px-1 rounded ml-1">robots.txt</code> from your
            current published blogs &amp; pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton variant="ghost" size="sm" onClick={genRobots} disabled={busy !== null}>
            <Download className="h-4 w-4" /> robots.txt
          </AdminButton>
          <AdminButton size="sm" onClick={genSitemap} disabled={busy !== null}>
            {busy === "sitemap" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            sitemap.xml
          </AdminButton>
        </div>
      </div>
    </AdminCard>
  );
}

function SeoEditor({
  docKey, label,
}: { docKey: Extract<SiteDocKey, `seo${string}`>; label: string }) {
  const { data, save, source } = useCmsDocument(docKey);

  const [title,       setTitle]       = useState<string>(data.title);
  const [description, setDescription] = useState<string>(data.description);
  const [keywords,    setKeywords]    = useState<string>(data.keywords);
  const [ogImage,     setOgImage]     = useState<string>(data.ogImage ?? "");
  const [canonical,   setCanonical]   = useState<string>(data.canonical ?? "");

  const [saving, setSaving] = useState(false);
  const guard = useDirtyGuard();

  // Sync from doc when it loads
  useEffect(() => {
    setTitle(data.title);
    setDescription(data.description);
    setKeywords(data.keywords);
    setOgImage(data.ogImage ?? "");
    setCanonical(data.canonical ?? "");
  }, [data]);

  function mark<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); guard.markDirty(); };
  }

  async function onSave() {
    setSaving(true);
    const res = await save({
      title, description, keywords,
      ogImage:   ogImage   || undefined,
      canonical: canonical || undefined,
    });
    setSaving(false);
    if (res.ok) { toast.success(`${label} SEO saved.`); guard.markClean(); }
    else toast.error(res.error || "Save failed");
  }

  return (
    <AdminCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-ink-900">{label} Page</h3>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${source === "firestore" ? "bg-emerald-50 text-emerald-700" : source === "local" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${source === "firestore" ? "bg-emerald-500" : source === "local" ? "bg-amber-500" : "bg-gray-400"}`} />
            {source}
          </span>
        </div>
        <Settings2 className="h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-3">
        <AdminField label="Meta Title">
          <AdminInput value={title} onChange={(e) => mark(setTitle)(e.target.value)} />
        </AdminField>
        <AdminField label="Meta Description">
          <AdminTextarea rows={2} value={description} onChange={(e) => mark(setDescription)(e.target.value)} />
        </AdminField>
        <AdminField label="Keywords">
          <AdminInput value={keywords} onChange={(e) => mark(setKeywords)(e.target.value)} />
        </AdminField>
        <AdminField label="OG Image URL">
          <AdminInput value={ogImage} onChange={(e) => mark(setOgImage)(e.target.value)} placeholder="https://…" />
        </AdminField>
        <AdminField label="Canonical URL">
          <AdminInput value={canonical} onChange={(e) => mark(setCanonical)(e.target.value)} placeholder="https://csgpl.in/…" />
        </AdminField>
      </div>

      <div className="mt-5 flex items-center justify-end">
        <AdminButton onClick={onSave} disabled={saving || !guard.dirty} size="sm">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : guard.dirty ? "Save Changes" : "Saved"}
        </AdminButton>
      </div>
    </AdminCard>
  );
}
