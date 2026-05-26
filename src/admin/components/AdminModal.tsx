import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * AdminModal — centered modal with backdrop, esc-to-close, body-scroll-lock.
 */
export default function AdminModal({
  open, title, onClose, children, footer, size = "md",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 animate-fade-up" style={{ animationDuration: ".25s" }}>
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#050912]/60 backdrop-blur-sm"
      />
      <div className={`relative w-full ${maxW} rounded-2xl bg-white shadow-premium border border-gray-100`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg grid place-items-center text-ink-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
