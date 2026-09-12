import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  History,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/create-bill", label: "Create Bill", icon: Receipt },
  { to: "/billing-history", label: "Billing History", icon: History },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop — only rendered when the drawer is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-64 bg-white border-r border-gray-200 flex flex-col
          fixed lg:sticky top-0 h-screen z-50
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-700">BillFlow</h1>
            <p className="text-xs text-gray-400 mt-0.5">Billing Management</p>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-400">
          v1.0.0 — Student Project
        </div>
      </aside>
    </>
  );
}
