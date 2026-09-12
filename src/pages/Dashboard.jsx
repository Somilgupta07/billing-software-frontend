import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Package,
  Users,
  Receipt,
  IndianRupee,
  Plus,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { LoadingState } from "../components/PageState";
import { getProducts } from "../api/products";
import { getCustomers } from "../api/customer";
import { getBills } from "../api/bills";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    bills: 0,
    revenue: 0,
  });
  const [lowStock, setLowStock] = useState([]);
  const [recentBills, setRecentBills] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [products, customers, bills] = await Promise.all([
          getProducts(),
          getCustomers(),
          getBills(),
        ]);
        const revenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);
        setStats({
          products: products.length,
          customers: customers.length,
          bills: bills.length,
          revenue,
        });
        setLowStock(products.filter((p) => p.quantity < 10).slice(0, 5));
        setRecentBills(bills.slice(0, 5));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your billing activity"
        action={
          <Link to="/create-bill" className="btn-primary">
            <Plus size={18} /> Create Bill
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.products}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.customers}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={Receipt}
          label="Bills Generated"
          value={stats.bills}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${stats.revenue.toFixed(2)}`}
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
            <Link
              to="/products"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              All products are well stocked.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{p.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Bills</h3>
            <Link
              to="/billing-history"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentBills.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No bills generated yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <Link
                  key={bill._id}
                  to={`/billing-history/${bill._id}`}
                  className="flex items-center justify-between text-sm hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
                >
                  <span className="text-gray-700">
                    {bill.customer?.name || "Unknown"}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{bill.totalAmount.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
