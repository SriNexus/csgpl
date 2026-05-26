/**
 * MediaUploader — instant-preview uploader.
 *
 * UX flow:
 *   1. User picks/drops a file → we create a blob URL (microseconds)
 *      and emit it via `onPreview` so the parent form/card paints the
 *      image RIGHT NOW.
 *   2. The real upload runs in the background.
 *   3. When the real URL is ready, we emit `onUploaded(realUrl, record)`
 *      so the parent can swap the blob URL for the durable URL.
 *
 * This makes logo/image uploads feel instant — the user sees their image
 * the moment they drop it; the network round-trip happens out of sight.
 */

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, XCircle, Check } from "lucide-react";
import { cmsStorage, type MediaRecord } from "@/cms";
import { ACCEPTED_INPUT_ACCEPT } from "@/cms/services/imageProcessor";
import { createUploadController, type UploadController } from "@/cms/services/storage";
import { toast } from "@/admin/ui/toast";

export interface MediaUploaderProps {
  folder?: string;
  /** Fired the instant the user picks a file — pass a local blob URL for instant preview. */
  onPreview?: (blobUrl: string) => void;
  /** Fired when the real upload completes (Firebase or fallback). */
  onUploaded?: (url: string, record: MediaRecord) => void;
  className?: string;
  hint?: string;
}

export default function MediaUploader({
  folder = "uploads",
  onPreview,
  onUploaded,
  className,
  hint,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<UploadController | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const [busy, setBusy]         = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [attempt, setAttempt]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(false);

  // Revoke any pending blob URL on unmount
  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  }, []);

  async function uploadFile(file: File) {
    setError(null);
    setJustUploaded(false);

    /* INSTANT PREVIEW — paint the image before the upload starts */
    try {
      const previewUrl = URL.createObjectURL(file);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = previewUrl;
      onPreview?.(previewUrl);
    } catch { /* harmless */ }

    setBusy(true);
    setProgress(0);
    setAttempt(1);

    const controller = createUploadController();
    controllerRef.current = controller;

    const res = await cmsStorage.uploadImage(
      file,
      folder,
      (p) => { setProgress(p.ratio); setAttempt(p.attempt); },
      { signal: controller },
    );

    controllerRef.current = null;
    setBusy(false);
    setProgress(null);
    setAttempt(0);
    if (inputRef.current) inputRef.current.value = "";

    if (res.ok && res.url && res.record) {
      onUploaded?.(res.url, res.record);
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 1800);

      // Release blob URL after a short delay so the swap is visually seamless
      setTimeout(() => {
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
      }, 1000);

      toast.success(`Uploaded "${file.name}".`);
    } else {
      const msg = res.error || "Upload failed.";
      setError(res.remedy ? `${msg}\n${res.remedy}` : msg);
      toast.error(msg);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function onCancel(e: React.MouseEvent) {
    e.stopPropagation();
    controllerRef.current?.cancel();
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); setDragging(true); }
  function onDragLeave(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); setDragging(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); e.stopPropagation(); setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        aria-disabled={busy}
        className={`relative w-full rounded-2xl border-2 border-dashed transition px-4 py-7 text-center cursor-pointer
          ${dragging ? "border-brand-500 bg-brand-50/60" : "border-gray-200 hover:border-brand-400 hover:bg-brand-50/30"}
          ${busy ? "opacity-90 pointer-events-none" : ""}`}
      >
        {busy ? (
          <span className="inline-flex flex-col items-center gap-2 text-sm font-semibold text-brand-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>
              Uploading{progress != null ? ` ${Math.round(progress * 100)}%` : "…"}
              {attempt > 1 && <span className="ml-2 text-amber-600">(retry {attempt})</span>}
            </span>
            {progress != null && (
              <span className="block w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <span
                  className="block h-full bg-gradient-to-r from-brand-500 to-amber-400 transition-[width]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </span>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="pointer-events-auto mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
            >
              <XCircle className="h-3.5 w-3.5" /> Cancel
            </button>
          </span>
        ) : justUploaded ? (
          <span className="inline-flex flex-col items-center gap-2 text-sm font-semibold text-emerald-700">
            <span className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center">
              <Check className="h-5 w-5" />
            </span>
            <span>Uploaded ✓</span>
            <span className="text-[11px] text-gray-500 font-normal">Drop another file to replace</span>
          </span>
        ) : (
          <span className="inline-flex flex-col items-center gap-2 text-sm font-semibold text-ink-700">
            <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
              <Upload className="h-5 w-5" />
            </span>
            <span className="text-ink-900">{dragging ? "Drop to upload" : "Click to upload, or drag & drop"}</span>
            <span className="text-[11px] text-gray-500 font-normal">
              {hint || "PNG · JPG · WEBP · SVG · ICO — up to 15 MB"}
            </span>
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT_ACCEPT}
        className="hidden"
        onChange={onChange}
      />

      {error && (
        <pre className="mt-2 whitespace-pre-wrap text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 leading-relaxed">
          {error}
        </pre>
      )}
    </div>
  );
}
