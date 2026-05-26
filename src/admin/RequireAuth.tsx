import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

/**
 * Route-guard wrapper for admin pages.
 * Renders children only when the user is authenticated.
 * While Firebase auth is hydrating, returns a tiny loading shell to avoid flash.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, ready } = useAuth();
  const loc = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-paper">
        <div className="h-8 w-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }

  return <>{children}</>;
}
