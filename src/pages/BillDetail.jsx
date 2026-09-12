import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Printer } from "lucide-react";
import { LoadingState } from "../components/PageState";
import { getBill } from "../api/bills";

export default function BillDetail() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBill(id);
        setBill(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingState label="Loading bill..." />;
  if (!bill) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/billing-history"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} /> Back to Billing History
        </Link>
        <button className="btn-secondary" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
      </div>

      <div className="card p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoice</h1>
            <p className="text-sm text-gray-400">Bill ID: {bill._id}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            {new Date(bill.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Billed To
          </h3>
          <p className="font-medium text-gray-900">{bill.customer?.name}</p>
          <p className="text-sm text-gray-500">{bill.customer?.phone}</p>
          <p className="text-sm text-gray-500">{bill.customer?.address}</p>
        </div>

        <table className="w-full mb-6">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="table-header pl-0">Item</th>
              <th className="table-header text-right">Price</th>
              <th className="table-header text-right">Qty</th>
              <th className="table-header text-right pr-0">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bill.items.map((item, idx) => (
              <tr key={idx}>
                <td className="table-cell pl-0">
                  {item.name}
                  <div className="text-xs text-gray-400">{item.sku}</div>
                </td>
                <td className="table-cell text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="table-cell text-right">{item.quantity}</td>
                <td className="table-cell text-right pr-0 font-medium">
                  ₹{item.itemTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-sm ml-auto max-w-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount ({bill.discountPercent}%)</span>
            <span>−₹{bill.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({bill.taxPercent}%)</span>
            <span>+₹{bill.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
            <span>Total Paid</span>
            <span>₹{bill.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
