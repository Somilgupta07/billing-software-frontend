import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadingState, EmptyState } from "../components/PageState";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";

const emptyForm = { name: "", sku: "", price: "", quantity: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (form.price === "" || Number(form.price) < 0)
      errs.price = "Enter a valid non-negative price";
    if (
      form.quantity === "" ||
      Number(form.quantity) < 0 ||
      !Number.isInteger(Number(form.quantity))
    )
      errs.quantity = "Enter a valid non-negative whole number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      setSaving(true);
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product added");
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProduct(deleteTarget._id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog and stock levels"
        action={
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Product
          </button>
        }
      />

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState label="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first product to start building your catalog."
            action={
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={18} /> Add Product
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900 flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      {p.name}
                    </td>
                    <td className="table-cell text-gray-500">{p.sku}</td>
                    <td className="table-cell">₹{p.price.toFixed(2)}</td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.quantity === 0
                            ? "bg-red-100 text-red-700"
                            : p.quantity < 10
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {p.quantity} in stock
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-brand-600 transition-colors p-1.5"
                          onClick={() => openEditModal(p)}
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5"
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Product Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Notebook"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="label">SKU / Product Code</label>
            <input
              className="input-field"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="e.g. NB001"
            />
            {errors.sku && (
              <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="label">Available Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                className="input-field"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
