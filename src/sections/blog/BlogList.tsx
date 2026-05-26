/**
 * BlogList — public /blog listing.
 * Pure presentation — receives posts + filter state via props.
 */

import { Link } from "react-router-dom";
import { Section, SectionHeader, Badge, Image, Card } from "@/components/ui";
import type { BlogRecord, CategoryRecord } from "@/cms";
import { formatDate, readingTime } from "@/utils/content";

export interface BlogListProps {
  posts: BlogRecord[];
  categories: CategoryRecord[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function BlogList({ posts, categories, activeCategory, onCategoryChange }: BlogListProps) {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest     = posts.filter((p) => p.id !== featured?.id);

  return (
    <Section tone="paper" padding="xl" className="pt-32 md:pt-40">
      <SectionHeader
        eyebrow="Insights & Updates"
        title={
          <>
            <span className="serif font-normal text-ink-600">Solar</span>{" "}
            <span className="text-gradient-brand">stories from the field.</span>
          </>
        }
        description="Subsidy explainers, technical deep-dives & honest case studies — written by the CSGPL team."
      />

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <CategoryChip active={activeCategory === ""} onClick={() => onCategoryChange("")}>All</CategoryChip>
        {categories.map((c) => (
          <CategoryChip
            key={c.slug}
            active={activeCategory === c.slug}
            onClick={() => onCategoryChange(c.slug)}
          >
            {c.name}
          </CategoryChip>
        ))}
      </div>

      {posts.length === 0 ? (
        <Card padding="xl" className="mt-10 text-center">
          <p className="text-ink-600">No posts in this category yet — check back soon.</p>
        </Card>
      ) : (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {featured && <FeaturedCard post={featured} />}
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {rest.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------- decomposed pieces ---------- */

function CategoryChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
        active
          ? "bg-ink-900 text-white border-ink-900"
          : "bg-white text-ink-700 border-ink-900/10 hover:border-brand-400 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}

function FeaturedCard({ post }: { post: BlogRecord }) {
  const rt = readingTime(post.body || "");
  return (
    <article className="lg:col-span-12 group relative rounded-[1.75rem] overflow-hidden shadow-soft card-hover bg-white border hairline">
      <Link to={`/blog/${post.slug}`} className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="relative aspect-[16/10] lg:aspect-auto img-cinematic">
          <Image src={post.coverImage} alt={post.title} fallback="rooftop" className="h-full w-full object-cover img-zoom img-duotone" />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <Badge tone="amber" variant="loud">★ Featured</Badge>
          </div>
        </div>
        <div className="p-8 sm:p-10 flex flex-col">
          {post.categorySlug && <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">{post.categorySlug.replace(/-/g, " ")}</div>}
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink-900 leading-tight">{post.title}</h2>
          {post.excerpt && <p className="mt-4 text-ink-600 leading-relaxed">{post.excerpt}</p>}
          <div className="mt-auto pt-6 flex items-center gap-4 text-xs text-ink-500">
            <span className="font-semibold text-ink-700">{post.author || "CSGPL Editorial"}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{rt.minutes} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PostCard({ post }: { post: BlogRecord }) {
  const rt = readingTime(post.body || "");
  return (
    <article className="group relative rounded-[1.5rem] overflow-hidden shadow-soft card-hover bg-white border hairline">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] img-cinematic">
          <Image src={post.coverImage} alt={post.title} fallback="generic" className="h-full w-full object-cover img-zoom" />
        </div>
        <div className="p-6">
          {post.categorySlug && (
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-700">
              {post.categorySlug.replace(/-/g, " ")}
            </div>
          )}
          <h3 className="mt-2 text-lg font-bold tracking-tight text-ink-900 leading-snug">{post.title}</h3>
          {post.excerpt && <p className="mt-2 text-sm text-ink-600 leading-relaxed line-clamp-2">{post.excerpt}</p>}
          <div className="mt-4 pt-4 border-t hairline flex items-center justify-between text-[11px] text-ink-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{rt.minutes} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
