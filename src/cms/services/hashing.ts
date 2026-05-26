/**
 * hashing — content-based deduplication for media uploads.
 *
 * Uses SHA-256 via the WebCrypto subtle API (zero-dep, available in every
 * modern browser). Hashing a 2 MB file takes ~5-15 ms on commodity hardware.
 */

export async function sha256(file: File): Promise<string> {
  // Some browsers (older Firefox in private mode) don't expose subtle.
  if (!globalThis.crypto?.subtle) return fallbackHash(file);
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Cheap non-crypto fallback (size + first/last bytes). */
async function fallbackHash(file: File): Promise<string> {
  try {
    const head = await file.slice(0, 1024).arrayBuffer();
    const tail = await file.slice(Math.max(0, file.size - 1024)).arrayBuffer();
    let h = 0;
    new Uint8Array(head).forEach((b) => { h = (h * 31 + b) | 0; });
    new Uint8Array(tail).forEach((b) => { h = (h * 31 + b) | 0; });
    return `len${file.size}_${(h >>> 0).toString(16)}`;
  } catch {
    return `len${file.size}_${file.name}`;
  }
}
