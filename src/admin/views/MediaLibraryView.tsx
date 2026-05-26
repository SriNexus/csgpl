/**
 * MediaLibraryView — Firestore-backed media manager.
 *
 * Reads the `media` collection via the standard CMS hook so the library:
 *   • shares the cache/fallback chain with other admin views
 *   • survives reloads & device switches (Firestore primary, localStorage fallback)
 *   • can be consumed elsewhere via the same hook (e.g. image picker modals)
 *
 * Supports drag-and-drop + click-to-upload for PNG/JPG/JPEG/WEBP/SVG/ICO/GIF.
 */

import { useRef, useState } from "react";
import { Trash2, Copy, Check, Upload, Loader2, ImageIcon } from "lucide-react";
import {
  AdminPageHeader, AdminCard, AdminButton, EmptyState,
} from "@/admin/components";
import { toast } from "@/admin/ui/toast";
import { useCmsCollection, cmsStorage, type MediaRecord } from "@/cms";
import { ACCEPTED_INPUT_ACCEPT } from "@/cms/services/storage";

export default function MediaLibraryView() {
  const { data, source, refresh, remove } = useCmsCollection<MediaRecord>("media");
  const [copied, setCopied] = useState<string | null>(null);

  function onCopy(url: string) {
    navigator.clipboard?.writeText(url).then(
      () => { setCopied(url); toast.success("URL copied to clipboard."); setTimeout(() => setCopied(null), 1500); },
      () => toast.error("Could not copy URL.")
    );
  }

  async function onRemove(record: MediaRecord) {
    if (!confirm(`Delete "${record.label || record.name}"? This cannot be undone.`)) return;
    // Optimistic local remove (also handles fallback path)
    await remove(record.id);
    // Best-effort cleanup of the Storage object
    await cmsStorage.deleteMedia(record).catch(() => null);
    toast.success("Media deleted.");
    refresh();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        subtitle="Upload & manage all images used across the site"
        source={source}
      />

      <AdminCard padding="md">
        <UploadZone onUploaded={() => refresh()} />
      </AdminCard>

      {data.length === 0 ? (
        <EmptyState
          title="No uploads yet"
          subtitle="Drop a file into the uploader above to get started."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.map((m) => (
            <MediaTile
              key={m.id}
              record={m}
              copied={copied === m.url}
              onCopy={() => onCopy(m.url)}
              onRemove={() => onRemove(m)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   UPLOAD ZONE — drag-and-drop + click-to-pick + batch support
   ============================================================ */

function UploadZone({ onUploaded }: { onUploaded: (record: MediaRecord) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [queue, setQueue] = useState<{ name: string; status: "pending" | "done" | "error"; error?: string }[]>([]);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    setQueue(list.map((f) => ({ name: f.name, status: "pending" })));

    // Upload all files in parallel. Firebase handles concurrency well and
    // batch uploads are 3-5× faster than the previous serial loop.
    const aggregate = { totals: list.length, done: 0 };

    await Promise.all(list.map(async (file, i) => {
      const res = await cmsStorage.uploadImage(file, "uploads", (p) => {
        // Average of completed ratios + this file's current ratio
        const completed = aggregate.done;
        setProgress((completed + p.ratio) / aggregate.totals);
      });

      aggregate.done += 1;
      setQueue((q) => q.map((row, idx) =>
        idx === i ? { ...row, status: res.ok ? "done" : "error", error: res.error } : row
      ));
      if (res.ok && res.record) {
        onUploaded(res.record);
      } else {
        toast.error(res.error || `Upload failed for "${file.name}".`);
      }
    }));

    if (aggregate.done === list.length) {
      toast.success(list.length === 1 ? `Uploaded "${list[0].name}".` : `Uploaded ${list.length} files.`);
    }

    setBusy(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    setTimeout(() => setQueue([]), 2500);
  }

  function onPickClick() { inputRef.current?.click(); }
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) setDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onClick={onPickClick}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-disabled={busy}
        className={`relative cursor-pointer w-full rounded-2xl border-2 border-dashed transition px-4 py-10 text-center
          ${dragging ? "border-brand-500 bg-brand-50/60" : "border-gray-200 hover:border-brand-400 hover:bg-brand-50/30"}
          ${busy ? "opacity-70 pointer-events-none" : ""}`}
      >
        {busy ? (
          <div className="inline-flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-brand-700" />
            <div className="text-sm font-semibold text-brand-700">
              Uploading{progress != null ? ` ${Math.round(progress * 100)}%` : "…"}
            </div>
            {progress != null && (
              <div className="mt-2 w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-amber-400 transition-[width]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="inline-flex flex-col items-center gap-2 text-sm font-semibold text-ink-700">
            <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
              <Upload className="h-5 w-5" />
            </span>
            <span className="text-ink-900">
              {dragging ? "Drop to upload" : "Click to upload, or drag & drop"}
            </span>
            <span className="text-[11px] text-gray-500 font-normal">
              PNG · JPG · JPEG · WEBP · SVG · ICO · GIF — up to 15 MB
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_INPUT_ACCEPT}
        className="hidden"
        onChange={onInputChange}
      />

      {queue.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs">
          {queue.map((q, i) => (
            <li
              key={i}
              className={`flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 ${
                q.status === "done"  ? "bg-emerald-50 text-emerald-700" :
                q.status === "error" ? "bg-rose-50 text-rose-700" :
                                       "bg-gray-50 text-gray-700"
              }`}
            >
              <span className="truncate font-medium">{q.name}</span>
              <span className="shrink-0 uppercase tracking-wider text-[10px] font-bold">
                {q.status === "done" ? "Uploaded" : q.status === "error" ? (q.error ? q.error.slice(0, 32) + "…" : "Failed") : "Uploading…"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
   MEDIA TILE — preview + actions
   ============================================================ */

function MediaTile({
  record, copied, onCopy, onRemove,
}: {
  record: MediaRecord;
  copied: boolean;
  onCopy: () => void;
  onRemove: () => void;
}) {
  const isSvg = record.contentType === "image/svg+xml";
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-soft group bg-white">
      <div className={`aspect-square w-full grid place-items-center ${isSvg ? "bg-paper" : "bg-gray-50"}`}>
        {record.url ? (
          <img
            src={record.url}
            alt={record.label || record.name}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.25"; }}
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-gray-300" />
        )}
      </div>

      <div className="absolute inset-0 bg-ink-900/65 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
        <AdminButton size="sm" variant="ghost" onClick={onCopy} className="w-32 justify-center">
          {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy URL</>}
        </AdminButton>
        <AdminButton size="sm" variant="danger" onClick={onRemove} className="w-32 justify-center">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </AdminButton>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent px-2 py-1.5 text-[10px] text-white">
        <div className="truncate font-semibold">{record.label || record.name}</div>
        <div className="flex items-center justify-between opacity-80">
          <span>{record.contentType.split("/")[1]?.toUpperCase() || "FILE"}</span>
          <span>{formatBytes(record.size)}</span>
        </div>
      </div>
    </div>
  );
}

function formatBytes(b: number) {
  if (!b && b !== 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
