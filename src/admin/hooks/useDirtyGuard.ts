/**
 * useDirtyGuard — beforeunload protection + dirty flag helpers.
 *
 * Usage:
 *   const guard = useDirtyGuard();
 *   <input onChange={(e) => { setX(e.target.value); guard.markDirty(); }} />
 *   onSave: await save(); guard.markClean();
 *
 * Triggers the browser's native "Reload site? Changes you made may not be
 * saved." prompt while `dirty === true`.
 */

import { useCallback, useEffect, useState } from "react";

export function useDirtyGuard() {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore the message but require returnValue to be set
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const markDirty = useCallback(() => setDirty(true), []);
  const markClean = useCallback(() => setDirty(false), []);

  return { dirty, markDirty, markClean };
}
