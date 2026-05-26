/**
 * SolutionContainer — orchestrates a Solar Solution page.
 *   /solutions/:slug  → renders SolutionPage with the matching config.
 */

import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import SolutionPage from "@/sections/solutions/SolutionPage";
import { getSolutionBySlug } from "@/data/solutionsContent";

export default function SolutionContainer() {
  const { slug = "" } = useParams<{ slug: string }>();
  const config = getSolutionBySlug(slug);

  /* Per-page meta — we manage the head imperatively because each solution
     has its own title/description rather than a single CMS doc. */
  useEffect(() => {
    if (!config) return;
    const prevTitle = document.title;
    document.title = config.seo.title;

    const setMeta = (name: string, content: string) => {
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      const created = !el;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return () => {
        if (created) el?.remove();
        else if (prev !== null) el?.setAttribute("content", prev);
      };
    };
    const restore = setMeta("description", config.seo.description);
    return () => { document.title = prevTitle; restore(); };
  }, [config]);

  if (!config) return <Navigate to="/products" replace />;

  return (
    <main>
      <SolutionPage config={config} />
    </main>
  );
}
