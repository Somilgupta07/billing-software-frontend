import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadingState, EmptyState } from "../components/PageState";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customer";

const emptyForm = { name: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^[0-9]{10}$/.test(form.phone.trim()))
      errs.phone = "Phone must be exactly 10 digits";
    if (!form.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    try {
      setSaving(true);
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, payload);
        toast.success("Customer updated");
      } else {
        await createCustomer(payload);
        toast.success("Customer added");
      }
      setModalOpen(false);
      loadCustomers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCustomer(deleteTarget._id);
      toast.success("Customer deleted");
      setDeleteTarget(null);
      loadCustomers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer records"
        action={
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Customer
          </button>
        }
      />

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingState label="Loading customers..." />
        ) : customers.length === 0 ? (
          <EmptyState
            title="No customers yet"
            description="Add your first customer to start creating bills."
            action={
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={18} /> Add Customer
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Address</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {c.name}
                    </td>
                    <td className="table-cell text-gray-500">{c.phone}</td>
                    <td className="table-cell text-gray-500">{c.address}</td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-brand-600 transition-colors p-1.5"
                          onClick={() => openEditModal(c)}
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5"
                          onClick={() => setDeleteTarget(c)}
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
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit number"
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="label">Address</label>
            <textarea
              className="input-field"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street, City, State"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
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
                : editingCustomer
                  ? "Save Changes"
                  : "Add Customer"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
