import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <p className="text-sm text-gray-600 pt-1.5">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
