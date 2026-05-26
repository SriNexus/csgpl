/**
 * Favicon — runtime patcher for the browser tab icon.
 * Reads the `branding` singleton (favicon + appleTouchIcon) and updates
 * the corresponding <link> tags. Restores prior values on unmount.
 */

import { useEffect } from "react";
import { useCmsDocument } from "@/cms";

function upsertLink(rel: string, href: string): () => void {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  const created = !el;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("href");
  el.setAttribute("href", href);
  return () => {
    if (created) el?.remove();
    else if (prev !== null) el?.setAttribute("href", prev);
    else el?.removeAttribute("href");
  };
}

function inferType(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg") || lower.includes("svg+xml")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return null;
}

export default function Favicon() {
  const { data } = useCmsDocument("branding");

  useEffect(() => {
    const restorers: Array<() => void> = [];

    if (data.favicon) {
      restorers.push(upsertLink("icon", data.favicon));
      const link = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      const t = inferType(data.favicon);
      if (link && t) {
        const prevType = link.getAttribute("type");
        link.setAttribute("type", t);
        restorers.push(() => {
          if (prevType !== null) link.setAttribute("type", prevType);
          else link.removeAttribute("type");
        });
      }
    }

    if (data.appleTouchIcon) {
      restorers.push(upsertLink("apple-touch-icon", data.appleTouchIcon));
    }

    return () => { restorers.forEach((fn) => { try { fn(); } catch { /* noop */ } }); };
  }, [data.favicon, data.appleTouchIcon]);

  return null;
}
