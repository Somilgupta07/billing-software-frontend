import Spinner from "./Spinner";
import { Inbox } from "lucide-react";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Inbox size={22} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
