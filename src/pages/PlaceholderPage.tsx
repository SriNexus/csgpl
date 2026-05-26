import { Link } from "react-router-dom";
import { ArrowRight, Construction } from "lucide-react";

export default function PlaceholderPage({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <main className="pt-32 pb-24 min-h-[70vh] bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-semibold mb-4">
          <Construction className="h-3.5 w-3.5" /> COMING SOON
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink-900">
          {title}
        </h1>
        {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
        <p className="mt-6 text-gray-600 max-w-xl mx-auto">
          This page is being crafted with the same premium experience as our homepage. In the meantime, get a free consultation or reach out to our team.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/" className="btn-ghost rounded-full px-6 py-3 text-sm font-semibold">Back to Home</Link>
          <Link to="/#consultation" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
            Get Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
