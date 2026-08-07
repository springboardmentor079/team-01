import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProcurements,
  addProcurement,
  approveProcurementThunk,
  orderProcurementThunk,
  deliverProcurementThunk,
  cancelProcurementThunk,
} from "../../features/procurement/procurementSlice";
import { fetchProjects } from "../../features/projects/projectSlice";
import { fetchVendors } from "../../features/vendors/vendorSlice";
import { fetchInventory } from "../../features/inventory/inventorySlice";
import { fetchNotifications } from "../../features/notifications/notificationSlice";

const statusStyles = {
  requested: "bg-gray-100 text-gray-700",
  approved: "bg-blue-100 text-blue-700",
  ordered: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ProcurementDashboard = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector(
    (state) => state.procurement,
  );
  const { projects } = useSelector((state) => state.projects);
  const { vendors } = useSelector((state) => state.vendors);
  const { items: inventoryItems } = useSelector((state) => state.inventory);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    vendorId: "",
    inventoryId: "",
    itemName: "",
    quantity: "",
    unitPrice: "",
    notes: "",
  });
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliverState, setDeliverState] = useState({ id: null });
  const [deliverForm, setDeliverForm] = useState({
    deliveredQuantity: "",
    notes: "",
  });

  useEffect(() => {
    const params = {};
    if (projectFilter) params.projectId = projectFilter;
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchProcurements(params));
    dispatch(fetchProjects({ page: 1, limit: 100 }));
    dispatch(fetchVendors());
    dispatch(fetchInventory({}));
  }, [dispatch, projectFilter, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleInventorySelect = (event) => {
    const inventoryId = event.target.value;
    const selected = inventoryItems.find((item) => item._id === inventoryId);
    setForm((current) => ({
      ...current,
      inventoryId,
      itemName: selected ? selected.itemName : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !form.projectId ||
      !form.vendorId ||
      !form.inventoryId ||
      !form.quantity
    )
      return;

    try {
      await dispatch(addProcurement(form)).unwrap();
      setForm({
        projectId: "",
        vendorId: "",
        inventoryId: "",
        itemName: "",
        quantity: "",
        unitPrice: "",
        notes: "",
      });
      setShowForm(false);
    } catch (submitError) {
      // error surfaces via Redux state
    }
  };

  const handleApprove = async (id) => {
    await dispatch(approveProcurementThunk(id));
    dispatch(fetchNotifications());
  };

  const handleOrder = async (id) => {
    await dispatch(orderProcurementThunk(id));
    dispatch(fetchNotifications());
  };

  const openDeliver = (id) => {
    setDeliverState({ id });
    setDeliverForm({ deliveredQuantity: "", notes: "" });
  };

  const closeDeliver = () => {
    setDeliverState({ id: null });
  };

  const handleDeliverConfirm = async (id) => {
    const deliveredQuantity = Number(deliverForm.deliveredQuantity);
    if (!deliveredQuantity) return;

    try {
      await dispatch(
        deliverProcurementThunk({
          id,
          data: { deliveredQuantity, notes: deliverForm.notes },
        }),
      ).unwrap();
      dispatch(fetchNotifications());
      closeDeliver();
    } catch (deliverError) {
      // error surfaces via Redux state
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this procurement request?")) {
      await dispatch(
        cancelProcurementThunk({ id, data: { notes: "Cancelled by user" } }),
      );
      dispatch(fetchNotifications());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Procurement Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track material requests from vendor through delivery.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
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
              Vendor
            </label>
            <select
              name="vendorId"
              value={form.vendorId}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Inventory Item
            </label>
            <select
              name="inventoryId"
              value={form.inventoryId}
              onChange={handleInventorySelect}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select item</option>
              {inventoryItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Request
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
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="ordered">Ordered</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
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
          Loading procurement requests...
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
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Qty
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
            {requests.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No procurement requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {req.itemName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {req.projectId?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {req.vendorId?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {req.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {deliverState.id === req._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Delivered qty"
                          value={deliverForm.deliveredQuantity}
                          onChange={(e) =>
                            setDeliverForm((f) => ({
                              ...f,
                              deliveredQuantity: e.target.value,
                            }))
                          }
                          className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          value={deliverForm.notes}
                          onChange={(e) =>
                            setDeliverForm((f) => ({
                              ...f,
                              notes: e.target.value,
                            }))
                          }
                          className="w-28 rounded-lg border border-gray-300 px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeliverConfirm(req._id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={closeDeliver}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {req.status === "requested" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(req._id)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Approve
                          </button>
                        )}
                        {req.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => handleOrder(req._id)}
                            className="text-sm text-amber-600 hover:underline"
                          >
                            Order
                          </button>
                        )}
                        {req.status === "ordered" && (
                          <button
                            type="button"
                            onClick={() => openDeliver(req._id)}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Deliver
                          </button>
                        )}
                        {req.status !== "delivered" &&
                          req.status !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => handleCancel(req._id)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Cancel
                            </button>
                          )}
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

export default ProcurementDashboard;
