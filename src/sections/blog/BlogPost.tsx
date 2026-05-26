/**
 * BlogPost — single article view.
 * Pure presentation. Receives `post`, optional `category`, and related list.
 */

import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Section, Image, Card } from "@/components/ui";
import type { BlogRecord, CategoryRecord } from "@/cms";
import { formatDate, readingTime, renderMarkdown } from "@/utils/content";

export interface BlogPostProps {
  post: BlogRecord;
  category?: CategoryRecord;
  related: BlogRecord[];
}

export default function BlogPost({ post, category, related }: BlogPostProps) {
  const rt = readingTime(post.body || "");
  const html = renderMarkdown(post.body || "");

  return (
    <Section tone="white" padding="xl" className="pt-32 md:pt-36">
      <article>
        <header className="max-w-3xl mx-auto text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-brand-700 uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>
          {category && (
            <div className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">{category.name}</div>
          )}
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-[-0.03em] text-ink-900 leading-[1.05]">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 lead mx-auto">{post.excerpt}</p>}
          <div className="mt-6 flex items-center justify-center gap-3 text-[12px] text-ink-500">
            <span className="font-semibold text-ink-700">{post.author || "CSGPL Editorial"}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{rt.minutes} min read</span>
          </div>
        </header>

        {post.coverImage && (
          <div className="mt-12 max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-premium ring-1 ring-ink-900/5 img-cinematic">
            <Image
              src={post.coverImage}
              alt={post.title}
              priority
              fallback="rooftop"
              className="w-full aspect-[16/9] object-cover img-duotone"
            />
          </div>
        )}

        <div
          className="mt-12 max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-12 max-w-3xl mx-auto flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-[11px] uppercase tracking-wider font-bold text-ink-700 bg-paper border hairline rounded-full px-3 py-1.5">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <aside className="mt-24 max-w-6xl mx-auto">
          <div className="eyebrow flex items-center gap-3 justify-center mb-8">
            <span className="h-px w-8 bg-brand-600" /> Related Reading
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="group">
                <Card interactive padding="none" className="overflow-hidden h-full">
                  <div className="relative aspect-[16/10] img-cinematic">
                    <Image src={r.coverImage} alt={r.title} fallback="generic" className="h-full w-full object-cover img-zoom" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-bold tracking-tight text-ink-900 leading-snug">{r.title}</h4>
                    <p className="mt-2 text-xs text-ink-500">{formatDate(r.publishedAt)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </Section>
  );
}
