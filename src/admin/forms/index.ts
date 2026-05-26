export { default as FormRenderer } from "./FormRenderer";
export type { FormErrors, FormRendererProps } from "./FormRenderer";
export * from "./types";

/** Validate a single value object against a schema. Returns map of errors. */
import type { Field, FieldValidator } from "./types";

function flattenFields(schema: Field[]): Array<{ key: string; validate?: FieldValidator; required?: boolean }> {
  const out: Array<{ key: string; validate?: FieldValidator; required?: boolean }> = [];
  for (const f of schema) {
    if (f.type === "group") { out.push(...flattenFields(f.fields)); continue; }
    if (f.type === "repeater") continue; // repeater items validated separately
    out.push({
      key: f.key,
      validate: (f as any).validate,
      required: (f as any).required,
    });
  }
  return out;
}

import { validators } from "./types";

export function validateSchema(schema: Field[], value: Record<string, any>): Record<string, string | undefined> {
  const errors: Record<string, string | undefined> = {};
  for (const f of flattenFields(schema)) {
    if (f.required) {
      const r = validators.required(value[f.key]);
      if (r) { errors[f.key] = r; continue; }
    }
    if (f.validate) {
      const r = f.validate(value[f.key], value);
      if (r) errors[f.key] = r;
    }
  }
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
