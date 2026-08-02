import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkers,
  addWorker,
  editWorker,
  removeWorker,
} from "../../features/workers/workerSlice";

const categoryOptions = [
  "Engineers",
  "Supervisors",
  "Contractors",
  "Skilled Workers",
  "Unskilled Workers",
  "Consultants",
];

const initialForm = {
  name: "",
  category: "Skilled Workers",
  contact: "",
  dailyWage: "",
};

const WorkerManagement = () => {
  const dispatch = useDispatch();
  const { workers, loading, error } = useSelector((state) => state.workers);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.dailyWage) {
      return;
    }

    const payload = { ...form, dailyWage: Number(form.dailyWage) };

    try {
      if (editingId) {
        await dispatch(
          editWorker({ id: editingId, updates: payload }),
        ).unwrap();
      } else {
        await dispatch(addWorker(payload)).unwrap();
      }
      resetForm();
    } catch (submitError) {
      // error surfaces via Redux state
    }
  };

  const handleEditClick = (worker) => {
    setEditingId(worker._id);
    setForm({
      name: worker.name,
      category: worker.category,
      contact: worker.contact || "",
      dailyWage: String(worker.dailyWage),
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this worker?")) {
      dispatch(removeWorker(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Worker Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Register and manage workforce records.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Worker"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Worker name"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact number"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="dailyWage"
            min="0"
            value={form.dailyWage}
            onChange={handleChange}
            placeholder="Daily wage"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:col-span-2"
          >
            {editingId ? "Update Worker" : "Register Worker"}
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading workers...
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Daily Wage
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {workers.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No workers registered yet.
                </td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {worker.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {worker.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {worker.contact || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {worker.dailyWage}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditClick(worker)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(worker._id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
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

export default WorkerManagement;
