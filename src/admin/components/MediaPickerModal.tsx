/**
 * MediaPickerModal — pick an existing media asset OR upload a new one.
 *
 *   <MediaPickerModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onPick={(url, record) => setForm({...form, image: url})}
 *   />
 *
 * Reads the same `media` Firestore collection as the Media Library, so any
 * upload made anywhere in the admin appears here instantly.
 */

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";
import EmptyState from "./EmptyState";
import MediaUploader from "./MediaUploader";
import { useCmsCollection, type MediaRecord } from "@/cms";

export interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (url: string, record: MediaRecord) => void;
  /** Restrict the picker to a single folder (e.g. "blog"). */
  folder?: string;
  /** Folder used for new uploads. Defaults to `folder` then "uploads". */
  uploadFolder?: string;
}

export default function MediaPickerModal({
  open, onClose, onPick, folder, uploadFolder,
}: MediaPickerModalProps) {
  const { data } = useCmsCollection<MediaRecord>("media");
  const [query, setQuery] = useState("");
  const [tab, setTab]     = useState<"library" | "upload">("library");
  const [selected, setSelected] = useState<MediaRecord | null>(null);

  const filtered = useMemo(() => {
    return data
      .filter((m) => (folder ? m.folder === folder : true))
      .filter((m) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (m.label || m.name).toLowerCase().includes(q) || (m.folder || "").includes(q);
      });
  }, [data, folder, query]);

  function commit() {
    if (!selected) return;
    onPick(selected.url, selected);
    setSelected(null);
    onClose();
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Select Media"
      size="lg"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
          <AdminButton onClick={commit} disabled={!selected}>
            <Check className="h-4 w-4" /> Use this image
          </AdminButton>
        </>
      }
    >
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
        <TabButton active={tab === "library"} onClick={() => setTab("library")}>Library</TabButton>
        <TabButton active={tab === "upload"}  onClick={() => setTab("upload")}>Upload new</TabButton>
        <div className="ml-auto" />
        {tab === "library" && (
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search filename…"
              className="rounded-lg border border-gray-200 pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {tab === "library" ? (
        filtered.length === 0 ? (
          <EmptyState
            title="No matching media"
            subtitle="Try a different search, or upload a new file."
          />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className={`group relative rounded-xl overflow-hidden border bg-white aspect-square w-full grid place-items-center transition ${
                    selected?.id === m.id ? "border-brand-500 ring-2 ring-brand-500/30" : "border-gray-100 hover:border-brand-300"
                  }`}
                >
                  <img src={m.url} alt={m.label || m.name} className="h-full w-full object-contain" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 to-transparent text-[10px] text-white text-left px-2 py-1 truncate">
                    {m.label || m.name}
                  </span>
                  {selected?.id === m.id && (
                    <span className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-brand-600 text-white grid place-items-center shadow">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <MediaUploader
          folder={uploadFolder ?? folder ?? "uploads"}
          onUploaded={(url, record) => onPick(url, record)}
        />
      )}
    </AdminModal>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm font-semibold px-3 py-2 -mb-px border-b-2 transition ${
        active ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}
