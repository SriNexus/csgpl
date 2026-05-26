/**
 * ThemeToggle — accessible light/dark switcher.
 *
 *   <ThemeToggle />            ← icon-only pill (Navbar default)
 *   <ThemeToggle size="sm" />  ← small variant (TopBar)
 *
 * Updates the document `data-theme` attribute via `useTheme`.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

export interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
  /** When true, the dark icon shows on a dark backdrop (for use inside dark surfaces). */
  inverse?: boolean;
}

export default function ThemeToggle({
  className,
  size = "md",
  inverse = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClass = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize  = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  const surfaceClass = inverse
    ? "bg-white/10 hover:bg-white/15 border border-white/15 text-white"
    : "bg-white hover:bg-paper border border-ink-900/10 text-ink-800 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid place-items-center rounded-full transition-colors no-tap shadow-soft",
        sizeClass,
        surfaceClass,
        className,
      )}
    >
      {/* Sun visible when dark (click to go light); Moon visible when light */}
      <Sun
        className={cn(iconSize, "absolute transition-all", isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0")}
        strokeWidth={2}
      />
      <Moon
        className={cn(iconSize, "absolute transition-all", isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")}
        strokeWidth={2}
      />
    </button>
  );
}
