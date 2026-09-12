import { Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <h1 className="text-lg font-bold text-brand-700">BillFlow</h1>
    </header>
  );
}
