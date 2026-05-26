/**
 * BlogPostContainer — orchestrates CMS reads for /blog/:slug.
 * Resolves the post + 3 related posts (same category, fallback to most recent).
 */

import { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCmsCollection, type BlogRecord, type CategoryRecord } from "@/cms";
import BlogPost from "@/sections/blog/BlogPost";
import { ArticleSeo } from "@/components/Seo";

export default function BlogPostContainer() {
  const { slug = "" } = useParams<{ slug: string }>();
  const posts      = useCmsCollection<BlogRecord>("blogs");
  const categories = useCmsCollection<CategoryRecord>("categories");

  const post = useMemo(
    () => posts.data.find((p) => p.slug === slug && p.status === "published"),
    [posts.data, slug]
  );

  const category = useMemo(
    () => categories.data.find((c) => c.slug === post?.categorySlug),
    [categories.data, post?.categorySlug]
  );

  const related = useMemo(() => {
    if (!post) return [];
    const sameCat = posts.data
      .filter((p) => p.id !== post.id && p.status === "published" && p.categorySlug === post.categorySlug)
      .sort((a, b) => +new Date(b.publishedAt ?? 0) - +new Date(a.publishedAt ?? 0));
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    // Fill with most recent other posts
    const others = posts.data
      .filter((p) => p.id !== post.id && p.status === "published" && !sameCat.find((s) => s.id === p.id))
      .sort((a, b) => +new Date(b.publishedAt ?? 0) - +new Date(a.publishedAt ?? 0));
    return [...sameCat, ...others].slice(0, 3);
  }, [posts.data, post]);

  // Only redirect once the CMS has loaded (avoid flashing 404 during initial fetch).
  if (!post && !posts.loading) return <Navigate to="/blog" replace />;
  if (!post) return null;

  return (
    <>
      <ArticleSeo post={post} />
      <BlogPost post={post} category={category} related={related} />
    </>
  );
}
