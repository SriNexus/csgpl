/**
 * Form engine — schema-driven, type-safe field renderer.
 *
 * Goals:
 *   • A single `<FormRenderer schema={...} value={...} onChange={...} />` drives
 *     every admin editor (blog, page, product, project, settings).
 *   • Supports text, textarea, markdown, number, boolean, select, image,
 *     repeater (array), section group, slug (auto-generated).
 *   • Validators are pure functions per field — no global form state library.
 *
 * Intentionally minimal — we don't need a heavy form lib for this scale.
 */

import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "tags"          // comma-separated input → string[]
  | "slug"          // auto-derived from another field, editable
  | "date"
  | "url";

export interface FieldValidator {
  /** Return undefined when valid, or an error message. */
  (value: unknown, all: Record<string, unknown>): string | undefined;
}

export interface BaseField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  /** Grid span — 1 (default) or 2 (full width). */
  span?: 1 | 2;
  /** Show field only when this returns true. Receives the whole value object. */
  visibleWhen?: (all: Record<string, unknown>) => boolean;
  validate?: FieldValidator;
  default?: unknown;
}

export interface SelectField extends BaseField {
  type: "select";
  options: { value: string; label: string }[];
}

export interface SlugField extends BaseField {
  type: "slug";
  /** Source field whose value seeds the slug. */
  sourceKey: string;
  /** When provided, slugs must be unique across this set. */
  existing?: () => readonly string[];
}

export interface ImageField extends BaseField {
  type: "image";
  /** Storage folder name (e.g. "blog", "products"). Defaults to "uploads". */
  folder?: string;
}

export interface RepeaterField {
  key: string;
  label: string;
  type: "repeater";
  /** Schema for ONE item of the repeater. */
  itemSchema: Field[];
  /** Min/max items. */
  min?: number;
  max?: number;
  /** Label shown in collapsed item rows. Default: index. */
  itemLabel?: (item: any, index: number) => ReactNode;
  /** Default value for a new item. */
  newItem?: () => Record<string, unknown>;
  span?: 1 | 2;
  hint?: string;
  visibleWhen?: (all: Record<string, unknown>) => boolean;
}

export interface GroupField {
  key: string;
  label: string;
  type: "group";
  /** Subset of fields rendered under a sub-heading. */
  fields: Field[];
  description?: string;
  span?: 1 | 2;
  visibleWhen?: (all: Record<string, unknown>) => boolean;
}

export type Field =
  | BaseField
  | SelectField
  | SlugField
  | ImageField
  | RepeaterField
  | GroupField;

/** A form schema is just an ordered field list. */
export type FormSchema = Field[];

/* ============================================================
   COMMON VALIDATORS
   ============================================================ */
export const validators = {
  required: (value: unknown): string | undefined => {
    if (value === undefined || value === null) return "Required";
    if (typeof value === "string" && !value.trim()) return "Required";
    if (Array.isArray(value) && value.length === 0) return "Required";
    return undefined;
  },
  minLength: (n: number) => (value: unknown) =>
    typeof value === "string" && value.length < n ? `Must be at least ${n} characters` : undefined,
  maxLength: (n: number) => (value: unknown) =>
    typeof value === "string" && value.length > n ? `Must be at most ${n} characters` : undefined,
  url: (value: unknown) => {
    if (!value) return undefined;
    if (typeof value !== "string") return "Must be a URL";
    if (!/^(https?:|\/|data:)/i.test(value)) return "Must be a valid URL";
    return undefined;
  },
};

/** Compose multiple validators into one. */
export function compose(...vs: (FieldValidator | undefined)[]): FieldValidator {
  return (value, all) => {
    for (const v of vs) {
      if (!v) continue;
      const r = v(value, all);
      if (r) return r;
    }
    return undefined;
  };
}
