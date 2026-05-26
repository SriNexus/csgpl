/**
 * BlogListContainer — orchestrates CMS reads for /blog.
 * Filters drafts, sorts by publishedAt desc, passes resolved props to BlogList.
 */

import { useMemo, useState } from "react";
import { useCmsCollection, type BlogRecord, type CategoryRecord } from "@/cms";
import BlogList from "@/sections/blog/BlogList";
import Seo from "@/components/Seo";

export default function BlogListContainer() {
  const posts      = useCmsCollection<BlogRecord>("blogs");
  const categories = useCmsCollection<CategoryRecord>("categories");
  const [category, setCategory] = useState<string>("");

  const published = useMemo(() => {
    return posts.data
      .filter((p) => p.status === "published")
      .filter((p) => !category || p.categorySlug === category)
      .sort((a, b) => +new Date(b.publishedAt ?? 0) - +new Date(a.publishedAt ?? 0));
  }, [posts.data, category]);

  return (
    <>
      <Seo docKey="seoBlog" />
      <BlogList
        posts={published}
        categories={categories.data}
        activeCategory={category}
        onCategoryChange={setCategory}
      />
    </>
  );
}
