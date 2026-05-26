import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  onConfirm, onCancel, tone = "danger",
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "danger" | "primary";
}) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel}>{cancelLabel}</AdminButton>
          <AdminButton variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</AdminButton>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${tone === "danger" ? "bg-rose-50 text-rose-600" : "bg-brand-50 text-brand-700"}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="text-sm text-ink-700 leading-relaxed">{message}</div>
      </div>
    </AdminModal>
  );
}
