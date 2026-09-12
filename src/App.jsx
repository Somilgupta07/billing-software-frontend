import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import CreateBill from "./pages/CreateBill";
import BillingHistory from "./pages/BillingHistory";
import BillDetail from "./pages/BillDetail";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="lg:flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/create-bill" element={<CreateBill />} />
            <Route path="/billing-history" element={<BillingHistory />} />
            <Route path="/billing-history/:id" element={<BillDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
