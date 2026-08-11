import { type ReactNode, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export function Modal({
  open, onClose, title, children, maxWidth = "max-w-lg",
}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-lift w-full ${maxWidth} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line flex-shrink-0">
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-mist hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, onClose, onConfirm,
  title, message, confirmLabel = "Confirm", danger = false,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {danger && (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-soft mb-4">
          <AlertTriangle size={22} className="text-brand" />
        </div>
      )}
      <p className="text-sm text-ink-soft mb-6 leading-relaxed">{message}</p>
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={onClose}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-mist transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
            danger ? "bg-brand hover:bg-brand-dark" : "bg-navy hover:bg-navy-dark"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
