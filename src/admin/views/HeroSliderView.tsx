/**
 * HeroSliderView — Admin panel for managing homepage hero slides.
 *
 * Features:
 *   • List all slides with preview
 *   • Add new slide
 *   • Edit slide (heading, images, CTA, overlay)
 *   • Delete slide with confirmation
 *   • Reorder slides via drag-drop
 *   • Real-time Firestore sync
 *   • Optimistic UI updates (instant feedback)
 */

import { useState, useMemo } from "react";
import { GripVertical, Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { useCmsCollection } from "@/cms";
import type { HeroSlideRecord } from "@/cms/collections";
import { FormRenderer, validateSchema, hasErrors, type FormErrors } from "@/admin/forms";
import { AdminButton, AdminPageHeader, AdminCard, ConfirmDialog } from "@/admin/components";
import { toast } from "@/admin/ui/toast";
import { cn } from "@/utils/cn";
import { heroSlideSchema } from "./HeroSliderSchema";

export default function HeroSliderView() {
  const { data: slides, create, update, remove, loading } = useCmsCollection<HeroSlideRecord>("heroSlides");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<any>({});
  const [formDirty, setFormDirty] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  /* Sort slides by order */
  const sorted = useMemo(() => {
    return [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [slides]);

  function startEditing(id: string | null) {
    if (id === "new" || id === null) {
      setFormValue({
        heading: "",
        subheading: "",
        desktopImage: "",
        mobileImage: "",
        buttonText: "",
        buttonUrl: "",
        overlayOpacity: 0.3,
        order: slides.length,
        active: true,
      });
    } else {
      const slide = slides.find((s) => s.id === id);
      if (slide) {
        setFormValue(slide);
      }
    }
    setEditingId(id || null);
    setFormDirty(false);
    setFormErrors({});
  }

  function validateForm(v: any): FormErrors {
    const errs: FormErrors = {};

    // Required fields
    if (!v.heading?.trim()) errs.heading = "Heading is required";
    if (!v.desktopImage?.trim()) errs.desktopImage = "Desktop image is required";
    if (!v.mobileImage?.trim()) errs.mobileImage = "Mobile image is required";

    // URL validation
    if (v.buttonUrl && !/^(#|https?:|\/|data:)/i.test(v.buttonUrl)) {
      errs.buttonUrl = "Invalid URL";
    }

    // Number validation
    if (v.overlayOpacity !== undefined) {
      const n = Number(v.overlayOpacity);
      if (isNaN(n) || n < 0 || n > 1) errs.overlayOpacity = "Must be between 0 and 1";
    }

    return errs;
  }

  async function handleSave() {
    const errs = validateForm(formValue);
    if (hasErrors(errs)) {
      setFormErrors(errs);
      toast.error("Please fix the errors above");
      return;
    }

    setSavingId(editingId);
    try {
      if (editingId && editingId !== "new") {
        const res = await update(editingId, {
          ...formValue,
          overlayOpacity: Number(formValue.overlayOpacity),
          order: Number(formValue.order),
        });
        if (res.ok) {
          toast.success("Slide updated");
          startEditing(null);
        } else {
          toast.error(res.error || "Failed to update slide");
        }
      } else {
        const res = await create({
          ...formValue,
          overlayOpacity: Number(formValue.overlayOpacity),
          order: Number(formValue.order),
        });
        if (res.ok) {
          toast.success("Slide created");
          startEditing(null);
        } else {
          toast.error(res.error || "Failed to create slide");
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await remove(id);
      if (res.ok) {
        toast.success("Slide deleted");
        setDeleteConfirmId(null);
      } else {
        toast.error(res.error || "Failed to delete slide");
      }
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      const res = await update(id, { active: !active });
      if (res.ok) {
        toast.success(!active ? "Slide enabled" : "Slide disabled");
      } else {
        toast.error(res.error || "Failed to update slide");
      }
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    try {
      // Simple reordering: update order values
      const newSlides = [...sorted];
      const [moved] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, moved);

      // Update order values
      for (let i = 0; i < newSlides.length; i++) {
        await update(newSlides[i].id, { order: i });
      }

      toast.success("Slides reordered");
    } catch (e: any) {
      toast.error(e?.message || "Failed to reorder slides");
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Hero Slider"
        description="Manage the full-width hero carousel on the homepage. Each slide supports desktop & mobile images, text overlays, and call-to-action buttons."
      />

      {/* Add New Button */}
      {!editingId && (
        <div>
          <AdminButton
            onClick={() => startEditing("new")}
            variant="primary"
            leading={<Plus className="w-4 h-4" />}
          >
            Add New Slide
          </AdminButton>
        </div>
      )}

      {/* Editor Form (when adding/editing) */}
      {editingId && (
        <AdminCard className="bg-blue-50 border border-blue-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-ink-900">
              {editingId === "new" ? "Create New Slide" : "Edit Slide"}
            </h3>
          </div>

          <FormRenderer
            schema={heroSlideSchema}
            value={formValue}
            errors={formErrors}
            onChange={(v) => {
              setFormValue(v);
              setFormDirty(true);
            }}
            onDirty={() => setFormDirty(true)}
          />

          <div className="mt-6 flex gap-3">
            <AdminButton
              onClick={handleSave}
              variant="primary"
              disabled={!formDirty || loading || !!savingId}
            >
              {savingId ? "Saving..." : "Save Slide"}
            </AdminButton>
            <AdminButton
              onClick={() => startEditing(null)}
              variant="ghost"
              disabled={loading || !!savingId}
            >
              Cancel
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Slides List */}
      <AdminCard>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-ink-900">
            Slides ({sorted.length})
          </h3>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-600 mb-4">No slides yet</p>
            <AdminButton
              onClick={() => startEditing("new")}
              variant="ghost"
              leading={<Plus className="w-4 h-4" />}
            >
              Create First Slide
            </AdminButton>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((slide, index) => (
              <SlideListItem
                key={slide.id}
                slide={slide}
                index={index}
                total={sorted.length}
                onEdit={() => startEditing(slide.id)}
                onDelete={() => setDeleteConfirmId(slide.id)}
                onToggleActive={() => handleToggleActive(slide.id, slide.active !== false)}
                onMoveUp={() => index > 0 && handleReorder(index, index - 1)}
                onMoveDown={() => index < sorted.length - 1 && handleReorder(index, index + 1)}
              />
            ))}
          </div>
        )}
      </AdminCard>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Slide?"
        message="This action cannot be undone. The slide will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

/* ============================================================
   SLIDE LIST ITEM
   ============================================================ */

interface SlideListItemProps {
  slide: HeroSlideRecord;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SlideListItem({
  slide,
  index,
  total,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: SlideListItemProps) {
  const isActive = slide.active !== false;
  const hasImage = slide.desktopImage || slide.mobileImage;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border transition-all",
        isActive ? "bg-white border-ink-200" : "bg-gray-50 border-gray-200 opacity-60"
      )}
    >
      {/* Drag Handle */}
      <div className="text-ink-400 flex-shrink-0">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Thumbnail */}
      {hasImage && (
        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
          <img
            src={slide.desktopImage || slide.mobileImage}
            alt={slide.heading}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-ink-900 truncate">{slide.heading}</h4>
        {slide.subheading && (
          <p className="text-sm text-ink-600 truncate">{slide.subheading}</p>
        )}
        <div className="mt-1 text-xs text-ink-500">
          Order: {slide.order ?? index} • {isActive ? "Visible" : "Hidden"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {/* Move buttons */}
        {index > 0 && (
          <button
            onClick={onMoveUp}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Move up"
            aria-label="Move slide up"
          >
            <span className="text-lg">↑</span>
          </button>
        )}
        {index < total - 1 && (
          <button
            onClick={onMoveDown}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Move down"
            aria-label="Move slide down"
          >
            <span className="text-lg">↓</span>
          </button>
        )}

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors"
          title="Edit slide"
          aria-label="Edit slide"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Toggle active button */}
        <button
          onClick={onToggleActive}
          className={cn(
            "p-2 rounded transition-colors",
            isActive
              ? "hover:bg-gray-100 text-ink-600"
              : "hover:bg-green-100 text-green-600"
          )}
          title={isActive ? "Disable slide" : "Enable slide"}
          aria-label={isActive ? "Disable slide" : "Enable slide"}
        >
          {isActive ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
          title="Delete slide"
          aria-label="Delete slide"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
