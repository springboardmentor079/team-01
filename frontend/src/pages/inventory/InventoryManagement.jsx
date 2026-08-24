import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  addInventoryItem,
  removeInventoryItem,
  restockInventoryItem,
  consumeInventoryItem,
  adjustInventoryStock,
} from "../../features/inventory/inventorySlice";
import { fetchProjects } from "../../features/projects/projectSlice";

const statusStyles = {
  "in-stock": "bg-green-100 text-green-700",
  "low-stock": "bg-amber-100 text-amber-700",
  "out-of-stock": "bg-red-100 text-red-700",
};

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { projects } = useSelector((state) => state.projects);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    itemName: "",
    category: "",
    unit: "",
    currentStock: 0,
    minThreshold: 0,
    unitPrice: "",
  });
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionState, setActionState] = useState({ id: null, type: null });
  const [actionForm, setActionForm] = useState({ quantity: "", reason: "" });

  useEffect(() => {
    const params = {};
    if (projectFilter) params.projectId = projectFilter;
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchInventory(params));
    dispatch(fetchProjects({ page: 1, limit: 100 }));
  }, [dispatch, projectFilter, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (!form.projectId || !form.itemName || !form.unit) return;

    try {
      await dispatch(addInventoryItem(form)).unwrap();
      setForm({
        projectId: "",
        itemName: "",
        category: "",
        unit: "",
        currentStock: 0,
        minThreshold: 0,
        unitPrice: "",
      });
      setShowForm(false);
    } catch (submitError) {
      // error surfaces via Redux state
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this inventory item?")) {
      dispatch(removeInventoryItem(id));
    }
  };

  const openAction = (id, type) => {
    setActionState({ id, type });
    setActionForm({ quantity: "", reason: "" });
  };

  const closeAction = () => {
    setActionState({ id: null, type: null });
  };

  const handleActionConfirm = async (id) => {
    const quantity = Number(actionForm.quantity);
    if (!quantity) return;

    const payload = { quantity, reason: actionForm.reason };

    try {
      if (actionState.type === "restock") {
        await dispatch(restockInventoryItem({ id, data: payload })).unwrap();
      } else if (actionState.type === "consume") {
        await dispatch(consumeInventoryItem({ id, data: payload })).unwrap();
      } else if (actionState.type === "adjust") {
        await dispatch(adjustInventoryStock({ id, data: payload })).unwrap();
      }
      closeAction();
    } catch (actionError) {
      // error surfaces via Redux state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track stock levels, restocks, and consumption across projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleFormChange}
              placeholder="e.g. Cement"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              placeholder="e.g. material"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleFormChange}
              placeholder="e.g. bags"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Opening Stock
            </label>
            <input
              type="number"
              name="currentStock"
              value={form.currentStock}
              onChange={handleFormChange}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Min Threshold
            </label>
            <input
              type="number"
              name="minThreshold"
              value={form.minThreshold}
              onChange={handleFormChange}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleFormChange}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Project:</label>
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading inventory...
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {item.itemName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {item.projectId?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {item.category || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {actionState.id === item._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={actionForm.quantity}
                          onChange={(e) =>
                            setActionForm((f) => ({
                              ...f,
                              quantity: e.target.value,
                            }))
                          }
                          className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Reason"
                          value={actionForm.reason}
                          onChange={(e) =>
                            setActionForm((f) => ({
                              ...f,
                              reason: e.target.value,
                            }))
                          }
                          className="w-28 rounded-lg border border-gray-300 px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleActionConfirm(item._id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={closeAction}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openAction(item._id, "restock")}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Restock
                        </button>
                        <button
                          type="button"
                          onClick={() => openAction(item._id, "consume")}
                          className="text-sm text-amber-600 hover:underline"
                        >
                          Consume
                        </button>
                        <button
                          type="button"
                          onClick={() => openAction(item._id, "adjust")}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Adjust
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
