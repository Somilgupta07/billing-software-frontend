import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2, Receipt, User } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { LoadingState } from "../components/PageState";
import { getProducts } from "../api/products";
import { getCustomers } from "../api/customer";
import { createBill } from "../api/bills";

export default function CreateBill() {
  const navigate = useNavigate();

  const [products, setProducts = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customerId, setCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [cart, setCart] = useState([]); // { productId, name, sku, price, quantity, stock }

  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, c] = await Promise.all([getProducts(), getCustomers()]);
        setProducts(p);
        setCustomers(c);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const availableProducts = products.filter((p) => p.quantity > 0);
  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const handleAddToCart = () => {
    if (!selectedProductId) {
      toast.error("Please select a product first");
      return;
    }
    const qty = Number(selectedQty);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    const existingInCart = cart.find(
      (item) => item.productId === selectedProductId,
    );
    const alreadyInCartQty = existingInCart ? existingInCart.quantity : 0;

    if (qty + alreadyInCartQty > selectedProduct.quantity) {
      toast.error(
        `Only ${selectedProduct.quantity} units of "${selectedProduct.name}" in stock (${alreadyInCartQty} already in cart)`,
      );
      return;
    }

    if (existingInCart) {
      setCart(
        cart.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          sku: selectedProduct.sku,
          price: selectedProduct.price,
          quantity: qty,
          stock: selectedProduct.quantity,
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQty(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const discountAmount = useMemo(
    () => (subtotal * Number(discountPercent || 0)) / 100,
    [subtotal, discountPercent],
  );
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = useMemo(
    () => (afterDiscount * Number(taxPercent || 0)) / 100,
    [afterDiscount, taxPercent],
  );
  const totalAmount = afterDiscount + taxAmount;

  const handleSubmitBill = async () => {
    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (cart.length === 0) {
      toast.error("Add at least one product to the bill");
      return;
    }
    if (discountPercent < 0 || discountPercent > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }
    if (taxPercent < 0 || taxPercent > 100) {
      toast.error("Tax must be between 0 and 100");
      return;
    }

    const payload = {
      customerId,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      discountPercent: Number(discountPercent || 0),
      taxPercent: Number(taxPercent || 0),
    };

    try {
      setSubmitting(true);
      const bill = await createBill(payload);
      toast.success("Bill created successfully");
      navigate(`/billing-history/${bill._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <LoadingState label="Loading products and customers..." />;

  return (
    <div>
      <PageHeader
        title="Create Bill"
        subtitle="Select a customer, add products, and generate a bill"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: customer + product selection */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="card p-5">
            <label className="label flex items-center gap-2">
              <User size={16} /> Customer
            </label>
            {customers.length === 0 ? (
              <p className="text-sm text-gray-400">
                No customers found. Add a customer first from the Customers
                page.
              </p>
            ) : (
              <select
                className="input-field"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.phone}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="card p-5">
            <label className="label">Add Product</label>
            {availableProducts.length === 0 ? (
              <p className="text-sm text-gray-400">
                No products in stock. Add products from the Products page.
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="input-field flex-1"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Select a product...</option>
                  {availableProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sku}) — ₹{p.price} — {p.quantity} in stock
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    className="input-field w-24"
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(e.target.value)}
                    placeholder="Qty"
                  />
                  <button
                    className="btn-primary shrink-0 flex-1 sm:flex-initial"
                    onClick={handleAddToCart}
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">
                Bill Items ({cart.length})
              </h3>
            </div>
            {cart.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No items added yet. Select a product above to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="table-header">Product</th>
                      <th className="table-header">Price</th>
                      <th className="table-header">Qty</th>
                      <th className="table-header">Item Total</th>
                      <th className="table-header"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <tr key={item.productId}>
                        <td className="table-cell font-medium text-gray-900">
                          {item.name}
                          <div className="text-xs text-gray-400">
                            {item.sku}
                          </div>
                        </td>
                        <td className="table-cell">₹{item.price.toFixed(2)}</td>
                        <td className="table-cell">{item.quantity}</td>
                        <td className="table-cell font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="table-cell text-right">
                          <button
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: summary panel */}
        <div className="order-1 lg:order-2">
          <div className="card p-5 lg:sticky lg:top-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt size={18} /> Bill Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="label">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input-field"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Tax / GST (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input-field"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount ({discountPercent || 0}%)</span>
                <span>−₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax ({taxPercent || 0}%)</span>
                <span>+₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total Payable</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-primary w-full mt-5"
              onClick={handleSubmitBill}
              disabled={submitting}
            >
              {submitting ? "Generating Bill..." : "Generate Bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
