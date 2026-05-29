/**
 * Hero Slide editor schema — fed into the FormRenderer.
 * Pure data: no JSX, no state, no side effects.
 */

import type { FormSchema } from "@/admin/forms";
import { validators, compose } from "@/admin/forms";

export const heroSlideSchema: FormSchema = [
  {
    key: "heading",
    label: "Slide Heading",
    type: "text",
    placeholder: "Power your future with smart solar energy",
    required: true,
    span: 2,
    validate: compose(validators.minLength(4), validators.maxLength(100)),
    hint: "Large, bold text displayed on the slide (max 100 chars)",
  },
  {
    key: "subheading",
    label: "Subheading",
    type: "textarea",
    placeholder: "Supporting text describing the offer or benefit",
    span: 2,
    validate: validators.maxLength(280),
    hint: "Optional supporting text (max 280 chars)",
  },
  {
    key: "desktopImage",
    label: "Desktop Image",
    type: "image",
    folder: "heroSlides",
    span: 2,
    required: true,
    hint: "Recommended: 1920 × 900 px. Used on desktop/tablet viewports.",
  },
  {
    key: "mobileImage",
    label: "Mobile Image",
    type: "image",
    folder: "heroSlides",
    span: 2,
    required: true,
    hint: "Recommended: 1080 × 1350 px. Auto-selected on mobile devices (<768px).",
  },
  {
    key: "buttonText",
    label: "Button Text",
    type: "text",
    placeholder: "Get Free Consultation",
    span: 1,
    hint: "Leave empty to hide the button",
  },
  {
    key: "buttonUrl",
    label: "Button URL",
    type: "url",
    placeholder: "#consultation",
    span: 1,
    validate: validators.url,
    hint: "Where the button links to (e.g., #section-id or https://...)",
  },
  {
    key: "overlayOpacity",
    label: "Overlay Opacity (0–1)",
    type: "number",
    span: 1,
    default: 0.3,
    hint: "Darkness of the overlay (0 = transparent, 1 = opaque). Default: 0.3",
  },
  {
    key: "order",
    label: "Display Order",
    type: "number",
    span: 1,
    default: 0,
    hint: "Lower numbers appear first in the carousel",
  },
  {
    key: "active",
    label: "Active (visible in carousel)",
    type: "boolean",
    span: 1,
    default: true,
    hint: "Uncheck to hide this slide from the carousel",
  },
];
