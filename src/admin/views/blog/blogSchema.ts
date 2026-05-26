/**
 * Blog editor schema — fed into the FormRenderer.
 * Pure data: no JSX, no state, no side effects. Trivial to evolve.
 */

import type { FormSchema } from "@/admin/forms";
import { validators, compose } from "@/admin/forms";

export function buildBlogSchema(opts: {
  categories: { value: string; label: string }[];
  existingSlugs: () => readonly string[];
}): FormSchema {
  return [
    {
      key: "title", label: "Title", type: "text",
      placeholder: "PM Surya Ghar Subsidy — 2026 Guide",
      required: true, span: 2,
      validate: compose(validators.minLength(4), validators.maxLength(140)),
    },
    {
      key: "slug", label: "Slug", type: "slug",
      sourceKey: "title", existing: opts.existingSlugs, span: 1,
      required: true,
    },
    {
      key: "status", label: "Status", type: "select",
      options: [
        { value: "draft",     label: "Draft" },
        { value: "published", label: "Published" },
      ],
      span: 1, required: true, default: "draft",
    },
    {
      key: "categorySlug", label: "Category", type: "select",
      options: opts.categories,
      span: 1,
    },
    { key: "author", label: "Author", type: "text", placeholder: "CSGPL Editorial", span: 1 },
    {
      key: "publishedAt", label: "Publish Date", type: "date", span: 1,
      hint: "Used for sorting and article schema",
    },
    { key: "featured", label: "Feature on blog homepage", type: "boolean", span: 1 },
    {
      key: "coverImage", label: "Cover Image", type: "image", folder: "blog",
      span: 2, hint: "Shown at the top of the article and on the listing card",
    },
    { key: "tags", label: "Tags", type: "tags", span: 2 },
    {
      key: "excerpt", label: "Excerpt", type: "textarea", span: 2,
      hint: "Plain-text preview shown on the listing page (auto-generated if empty)",
      validate: validators.maxLength(280),
    },
    {
      key: "body", label: "Body (Markdown)", type: "markdown", span: 2, required: true,
      hint: "Use #, ##, **bold**, *italic*, `code`, lists, > quotes, ```fenced```. Images via ![alt](url).",
    },
    {
      key: "_seoGroup", label: "SEO overrides", type: "group", span: 2,
      description: "Override the auto-generated meta tags. Leave empty to use title + excerpt.",
      fields: [
        { key: "seoTitle",       label: "Meta Title",       type: "text",     span: 2 },
        { key: "seoDescription", label: "Meta Description", type: "textarea", span: 2 },
        { key: "ogImage",        label: "OG Image URL",     type: "url",      span: 2 },
        { key: "canonical",      label: "Canonical URL",    type: "url",      span: 2 },
      ],
    },
  ];
}
