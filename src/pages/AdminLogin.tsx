import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { adminAuth, useAuth } from "@/admin/auth";

/**
 * AdminLogin — sign-in page.
 * Backed by `adminAuth.login()` which transparently handles Firebase + demo fallback.
 * If the user is already authenticated, redirects straight to /admin.
 */
export default function AdminLogin() {
  const nav = useNavigate();
  const { isAuthed, ready } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // If already logged in, skip the form
  useEffect(() => {
    if (ready && isAuthed) nav("/admin", { replace: true });
  }, [ready, isAuthed, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await adminAuth.login(email, password);
    setBusy(false);
    if (res.ok) {
      nav("/admin", { replace: true });
    } else {
      setErr(res.error || "Login failed");
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-ink-900 via-[#0a1424] to-ink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />

      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12">
        <div className="bg-white/95 rounded-2xl p-3 inline-block w-fit">
          <Logo />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 text-brand-300 px-3 py-1 text-xs font-semibold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> SECURE ADMIN
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to the <br />
            <span className="text-gradient-brand">CSGPL Admin Studio</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            A modern visual CMS to manage pages, leads, blogs, products, projects, testimonials & SEO — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
            {[
              { k: "Leads", v: "Manage" },
              { k: "Pages", v: "Visual Edit" },
              { k: "SEO", v: "Optimize" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs uppercase text-white/50 tracking-wider">{s.k}</div>
                <div className="font-bold mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-white/40">© 2023 ChaitanyaSri Greentech Pvt. Ltd.</div>
      </div>

      {/* Login form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white text-ink-900 p-8 shadow-premium">
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold">Sign in to Admin</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your website, leads & content.</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold">Email</span>
              <div className="mt-1 relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="admin@csgpl.in"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-semibold">Password</span>
              <div className="mt-1 relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
            </label>
          </div>

          {err && <div className="mt-4 text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2 border border-rose-200">{err}</div>}

          <button type="submit" disabled={busy} className="btn-primary mt-6 w-full rounded-xl py-3 text-sm font-bold inline-flex items-center justify-center gap-2">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>

          <div className="mt-5 text-[11px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <span className="font-semibold text-gray-700">Demo credentials:</span> admin@csgpl.in / admin123
          </div>
        </form>
      </div>
    </main>
  );
}
