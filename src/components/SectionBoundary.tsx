/**
 * SectionBoundary — error boundary scoped to a single homepage section.
 *
 * Purpose:
 *   • A single bad CMS record (e.g. malformed image URL, missing field) must
 *     never crash the whole homepage.
 *   • Logs the error in development; renders a minimal silent fallback in
 *     production to preserve the visual flow.
 *
 * NOTE: Error boundaries require class components in React 19.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  /** Identifier shown in dev logs (e.g. "Hero", "Projects"). */
  name: string;
  /** Optional fallback. Defaults to an invisible spacer that preserves rhythm. */
  fallback?: ReactNode;
  children: ReactNode;
}
interface State { hasError: boolean }

const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

export default class SectionBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Always log to console; richer dev panel only outside production
    // eslint-disable-next-line no-console
    console.error(`[SectionBoundary] "${this.props.name}" crashed:`, error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback !== undefined) return this.props.fallback;

    // Production: invisible fallback so the page keeps flowing.
    // Dev: a tiny labeled marker so the issue is visible.
    if (isDev) {
      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-5 text-sm">
            <div className="font-bold mb-1">Section "{this.props.name}" failed to render.</div>
            <div className="text-xs opacity-80">Check the console for details. The rest of the page continues normally.</div>
          </div>
        </div>
      );
    }
    return <div aria-hidden className="h-0" />;
  }
}
