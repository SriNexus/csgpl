import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import {
  AdminCard, AdminPageHeader, AdminField, AdminInput, AdminButton,
} from "@/admin/components";
import { useCmsDocument } from "@/cms";
import { firebaseReady } from "@/lib/firebase";
import { toast } from "@/admin/ui/toast";
import { useDirtyGuard } from "@/admin/hooks/useDirtyGuard";

export default function SettingsView() {
  const ready = firebaseReady();
  const { data, save, source } = useCmsDocument("settings");

  const [brandName,    setBrandName]    = useState<string>(data.brandName);
  const [legalName,    setLegalName]    = useState<string>(data.legalName);
  const [tagline,      setTagline]      = useState<string>(data.tagline);
  const [email,        setEmail]        = useState<string>(data.email);
  const [phonePrimary, setPhonePrimary] = useState<string>(data.phonePrimary);
  const [phoneRaw,     setPhoneRaw]     = useState<string>(data.phonePrimaryRaw);

  const [saving, setSaving] = useState(false);
  const guard = useDirtyGuard();

  useEffect(() => {
    setBrandName(data.brandName);
    setLegalName(data.legalName);
    setTagline(data.tagline);
    setEmail(data.email);
    setPhonePrimary(data.phonePrimary);
    setPhoneRaw(data.phonePrimaryRaw);
  }, [data]);

  function mark<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); guard.markDirty(); };
  }

  async function onSave() {
    setSaving(true);
    const res = await save({
      brandName, legalName, tagline, email,
      phonePrimary, phonePrimaryRaw: phoneRaw,
    });
    setSaving(false);
    if (res.ok) { toast.success("Settings saved."); guard.markClean(); }
    else toast.error(res.error || "Save failed");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        subtitle="Brand, contact & integration settings"
        source={source}
      />

      <AdminCard>
        <h3 className="font-bold text-ink-900 mb-1">Firebase Status</h3>
        <p className="text-sm text-gray-500 mb-4">Detects whether the Firebase SDK initialised successfully.</p>
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${ready ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
          <span className={`h-2 w-2 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-500"}`} />
          {ready ? "Firebase connected" : "Local-fallback mode"}
        </div>

        <div className="mt-5 rounded-xl bg-paper border hairline p-4 text-xs text-ink-700 space-y-3">
          <div className="font-bold uppercase tracking-wider text-[10px] text-ink-500">Storage upload checklist</div>
          <p>If image uploads fail, verify the following in your Firebase console:</p>
          <ol className="list-decimal pl-4 space-y-1.5">
            <li><b>Storage rules</b> allow authenticated writes. In <code className="font-mono bg-white px-1 rounded">Storage → Rules</code> use:
              <pre className="mt-1 bg-white border border-gray-200 rounded-md p-2 overflow-x-auto text-[11px] leading-snug">{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                 && request.resource.size < 15 * 1024 * 1024
                 && request.resource.contentType.matches('image/.*');
    }
  }
}`}</pre>
            </li>
            <li><b>CORS</b> is configured for your domain. Run once with <code className="font-mono bg-white px-1 rounded">gsutil</code>:
              <pre className="mt-1 bg-white border border-gray-200 rounded-md p-2 overflow-x-auto text-[11px] leading-snug">{`gsutil cors set cors.json gs://csgpl-83618.firebasestorage.app`}</pre>
              <span className="block mt-1">with <code className="font-mono bg-white px-1 rounded">cors.json</code> containing your origin(s) and methods <code className="font-mono bg-white px-1 rounded">GET, POST, PUT</code>.</span>
            </li>
            <li><b>Authentication</b> — admins must be signed in (the auth context is automatically used by Storage rules).</li>
            <li>If Storage upload fails, the system falls back to a <b>data-URL</b> (≤4 MB) so the workflow keeps working.</li>
          </ol>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink-900">Brand</h3>
          <AdminButton onClick={onSave} disabled={saving || !guard.dirty} size="sm">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : guard.dirty ? "Save Changes" : "Saved"}
          </AdminButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Brand Name (Wordmark)">
            <AdminInput value={brandName} onChange={(e) => mark(setBrandName)(e.target.value)} />
          </AdminField>
          <AdminField label="Legal Name">
            <AdminInput value={legalName} onChange={(e) => mark(setLegalName)(e.target.value)} />
          </AdminField>
          <AdminField label="Tagline">
            <AdminInput value={tagline} onChange={(e) => mark(setTagline)(e.target.value)} />
          </AdminField>
          <AdminField label="Email">
            <AdminInput value={email} onChange={(e) => mark(setEmail)(e.target.value)} />
          </AdminField>
          <AdminField label="Primary Phone (display)">
            <AdminInput value={phonePrimary} onChange={(e) => mark(setPhonePrimary)(e.target.value)} />
          </AdminField>
          <AdminField label="Primary Phone (dial)">
            <AdminInput value={phoneRaw} onChange={(e) => mark(setPhoneRaw)(e.target.value)} />
          </AdminField>
        </div>
      </AdminCard>
    </div>
  );
}
