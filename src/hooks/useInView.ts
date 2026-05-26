import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires `true` once the element enters the viewport.
 * `once: true` (default) keeps it true after the first reveal.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { once = true, ...obsOpts } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) ob.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold: 0.2, ...obsOpts });
    ob.observe(el);
    return () => ob.disconnect();
  }, [once]);

  return { ref, inView };
}
