/**
 * Content utilities — reusable helpers for blogs, dynamic pages & products.
 * All functions are pure & framework-agnostic.
 */

/* ============================================================
   SLUG
   ============================================================ */

/** Convert any string into a URL-safe slug. */
export function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")    // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Ensure a slug is unique within a list. Appends `-2`, `-3`, … if needed. */
export function uniqueSlug(base: string, existing: readonly string[]): string {
  const seed = slugify(base) || "post";
  if (!existing.includes(seed)) return seed;
  let i = 2;
  while (existing.includes(`${seed}-${i}`)) i++;
  return `${seed}-${i}`;
}

/* ============================================================
   TEXT
   ============================================================ */

/** Strip markdown / HTML to plain text (lossy — fine for excerpts). */
export function stripFormatting(input: string): string {
  return String(input)
    .replace(/```[\s\S]*?```/g, " ")     // fenced code
    .replace(/`[^`]*`/g, " ")            // inline code
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1") // links → text
    .replace(/<[^>]*>/g, " ")            // html
    .replace(/[#>*_~`-]+/g, " ")         // md punctuation
    .replace(/\s+/g, " ")
    .trim();
}

/** Auto-generate a plain-text excerpt (default 160 chars). */
export function excerpt(input: string, max = 160): string {
  const plain = stripFormatting(input);
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  // Trim mid-word
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/** ≈ Medium-style reading time — 200 wpm. */
export function readingTime(input: string, wpm = 200): { minutes: number; words: number } {
  const words = stripFormatting(input).split(/\s+/).filter(Boolean).length;
  return { minutes: Math.max(1, Math.round(words / wpm)), words };
}

/* ============================================================
   DATE
   ============================================================ */

/** "12 Mar 2026" */
export function formatDate(input: string | number | Date | undefined): string {
  if (!input) return "";
  try {
    return new Date(input).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return ""; }
}

/** "3 hours ago" — coarse relative time. */
export function timeAgo(input: string | number | Date | undefined): string {
  if (!input) return "";
  const d = new Date(input).getTime();
  if (isNaN(d)) return "";
  const diff = Math.max(0, Date.now() - d) / 1000;
  if (diff < 60)       return "just now";
  if (diff < 3600)     return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 86400*7)  return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 86400*30) return `${Math.floor(diff / 86400 / 7)} wk ago`;
  return formatDate(input);
}

/** ISO 8601 (used by article schema + sitemap). */
export function toIso(input: string | number | Date | undefined): string {
  if (!input) return "";
  try { return new Date(input).toISOString(); }
  catch { return ""; }
}

/* ============================================================
   MARKDOWN (minimal renderer — safe subset)
   ============================================================
   We intentionally avoid heavy libs. This handles the common
   blog markup:  # headings, **bold**, *italic*, `code`,
   ```fenced```, lists, blockquotes, links, images, hr, paragraphs.
   Output is sanitized HTML strings — consumers should pass them
   to `dangerouslySetInnerHTML`.
*/

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function inlineMd(line: string): string {
  // links + images (images first so ![ doesn't get matched as link)
  line = line.replace(/!\[([^\]]*)]\((https?:\/\/[^\s)]+|\/[^\s)]+|data:[^\s)]+)\)/g,
    '<img alt="$1" src="$2" loading="lazy" decoding="async" class="my-6 rounded-2xl shadow-soft" />');
  line = line.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+|\/[^\s)]+|#[^\s)]+)\)/g,
    '<a href="$2" class="text-brand-700 underline decoration-brand-300 hover:decoration-brand-700" rel="noopener noreferrer">$1</a>');

  // inline code
  line = line.replace(/`([^`]+)`/g, '<code class="rounded bg-paper-2 px-1.5 py-0.5 text-[0.92em] font-mono">$1</code>');
  // bold / italic (bold first to avoid eating *)
  line = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  line = line.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  return line;
}

/**
 * Minimal, safe markdown → HTML.
 * Only supports the blog-friendly subset — no inline HTML passthrough.
 */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  const src = md.replace(/\r\n/g, "\n").trim();
  const lines = src.split("\n");
  const out: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];

    // Fenced code block
    if (raw.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { buf.push(lines[i]); i++; }
      i++; // skip closing fence
      out.push(`<pre class="my-6 rounded-xl bg-ink-950 text-white p-5 overflow-x-auto text-sm leading-relaxed"><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // Heading
    const hMatch = /^(#{1,6})\s+(.+)$/.exec(raw);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = inlineMd(escapeHtml(hMatch[2].trim()));
      const cls = ({
        1: "mt-10 mb-4 text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-ink-900",
        2: "mt-10 mb-3 text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink-900",
        3: "mt-8  mb-2 text-xl sm:text-2xl font-bold text-ink-900",
        4: "mt-6  mb-2 text-lg font-bold text-ink-900",
        5: "mt-6  mb-2 text-base font-bold text-ink-900",
        6: "mt-6  mb-2 text-sm font-bold uppercase tracking-wider text-ink-700",
      } as Record<number, string>)[level];
      out.push(`<h${level} class="${cls}">${text}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(raw)) { out.push('<hr class="my-8 border-ink-900/10" />'); i++; continue; }

    // Blockquote
    if (raw.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push(`<blockquote class="my-6 border-l-4 border-brand-500 pl-5 italic text-ink-700">${inlineMd(escapeHtml(buf.join(" ")))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(raw)) {
      const buf: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { buf.push(lines[i].replace(/^[-*]\s+/, "")); i++; }
      out.push(`<ul class="my-5 list-disc pl-6 space-y-1.5 text-ink-800">${buf.map((b) => `<li>${inlineMd(escapeHtml(b))}</li>`).join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(raw)) {
      const buf: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { buf.push(lines[i].replace(/^\d+\.\s+/, "")); i++; }
      out.push(`<ol class="my-5 list-decimal pl-6 space-y-1.5 text-ink-800">${buf.map((b) => `<li>${inlineMd(escapeHtml(b))}</li>`).join("")}</ol>`);
      continue;
    }

    // Blank line
    if (!raw.trim()) { i++; continue; }

    // Paragraph (concatenate consecutive non-blank lines)
    const buf: string[] = [raw];
    i++;
    while (i < lines.length && lines[i].trim() && !/^([#>\-*]|\d+\.|```)/.test(lines[i])) {
      buf.push(lines[i]); i++;
    }
    out.push(`<p class="my-4 leading-[1.75] text-ink-800">${inlineMd(escapeHtml(buf.join(" ")))}</p>`);
  }

  return out.join("\n");
}
