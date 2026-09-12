import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Receipt } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { LoadingState, EmptyState } from "../components/PageState";
import { getBills } from "../api/bills";

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBills();
        setBills(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Billing History"
        subtitle="View all previously generated bills"
      />

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState label="Loading bills..." />
        ) : bills.length === 0 ? (
          <EmptyState
            title="No bills generated yet"
            description="Create your first bill from the Create Bill page."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Total</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="table-cell text-gray-500">
                      {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="table-cell font-medium text-gray-900">
                      {bill.customer?.name || "Unknown customer"}
                    </td>
                    <td className="table-cell text-gray-500">
                      {bill.items.length} item
                      {bill.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="table-cell font-semibold text-gray-900">
                      ₹{bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/billing-history/${bill._id}`}
                        className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-medium"
                      >
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
