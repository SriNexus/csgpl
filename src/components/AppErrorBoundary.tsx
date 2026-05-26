/**
 * AppErrorBoundary — top-level safety net.
 *
 * Catches any uncaught render error in the React tree, surfaces a friendly
 * recovery UI, and records the crash via diagnostics.
 *
 * Wraps the entire <App> tree. SectionBoundary still handles per-section
 * failures so this only fires for app-shell crashes.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { diagnostics } from "@/cms/services/diagnostics";

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    diagnostics.error("app.crash", error.message, {
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center bg-paper px-6">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-soft p-8 text-center">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 grid place-items-center text-xl">!</div>
          <h1 className="mt-4 text-xl font-extrabold text-ink-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink-600 leading-relaxed">
            The page couldn't render. The team has been notified — please reload.
          </p>
          {isDev && this.state.error && (
            <pre className="mt-4 text-[10px] text-left bg-rose-50 text-rose-700 border border-rose-200 rounded-md p-3 overflow-auto max-h-40">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack?.split("\n").slice(0, 6).join("\n")}
            </pre>
          )}
          <button
            type="button"
            onClick={this.reset}
            className="mt-6 btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}
