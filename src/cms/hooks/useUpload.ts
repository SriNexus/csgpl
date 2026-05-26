/**
 * useUpload — small hook for tracked file uploads (used by MediaUploader).
 */

import { useCallback, useState } from "react";
import { cmsStorage, type UploadProgress, type UploadResult } from "@/cms/services/storage";

export function useUpload(folder = "uploads") {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    setBusy(true); setError(null); setProgress(null);
    const res = await cmsStorage.uploadImage(file, folder, setProgress);
    setBusy(false);
    if (!res.ok) setError(res.error || "Upload failed");
    return res;
  }, [folder]);

  return { upload, progress, busy, error };
}
