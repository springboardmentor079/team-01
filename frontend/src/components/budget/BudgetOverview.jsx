import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpensesByProject,
  fetchBudgetSummary,
  addExpense,
  removeExpense,
} from "../../features/expenses/expenseSlice";

const CATEGORIES = [
  "labor",
  "material",
  "equipment",
  "transportation",
  "maintenance",
  "administrative",
];

export default function BudgetOverview({ projectId }) {
  const dispatch = useDispatch();
  const { items, summary, loading, summaryLoading, error } = useSelector(
    (state) => state.expenses,
  );
  const { user } = useSelector((state) => state.auth);
  const canAdd = user?.role === "admin" || user?.role === "project_manager";
  const canDelete = user?.role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    category: "labor",
    amount: "",
    date: "",
    description: "",
  });
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    dispatch(fetchExpensesByProject(projectId));
    dispatch(fetchBudgetSummary(projectId));
  }, [dispatch, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      addExpense({
        projectId,
        category: form.category,
        amount: Number(form.amount),
        date: form.date || undefined,
        description: form.description,
      }),
    );
    dispatch(fetchBudgetSummary(projectId));
    setForm({ category: "labor", amount: "", date: "", description: "" });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeleteError(null);
    const result = await dispatch(removeExpense(id));
    if (removeExpense.rejected.match(result)) {
      setDeleteError(
        result.payload || "Failed to delete expense. Please try again.",
      );
      return;
    }
    dispatch(fetchBudgetSummary(projectId));
  };

  const utilization = summary?.utilizationPercent;
  const overBudget = summary && summary.remaining < 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
        {canAdd && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            + Add Expense
          </button>
        )}
      </div>

      {summaryLoading && (
        <p className="text-gray-500 text-sm">Loading summary...</p>
      )}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded p-4">
            <p className="text-xs text-gray-500">Planned Budget</p>
            <p className="text-xl font-bold text-blue-700">
              ₹{summary.plannedBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-amber-50 rounded p-4">
            <p className="text-xs text-gray-500">Actual Spend</p>
            <p className="text-xl font-bold text-amber-700">
              ₹{summary.actualSpend.toLocaleString()}
            </p>
          </div>
          <div
            className={`rounded p-4 ${overBudget ? "bg-red-50" : "bg-green-50"}`}
          >
            <p className="text-xs text-gray-500">Remaining</p>
            <p
              className={`text-xl font-bold ${overBudget ? "text-red-700" : "text-green-700"}`}
            >
              ₹{summary.remaining.toLocaleString()}
              {utilization !== null && utilization !== undefined && (
                <span className="text-xs font-normal ml-2">
                  ({utilization}% used)
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {summary?.categoryBreakdown?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">By Category</p>
          <div className="space-y-1">
            {summary.categoryBreakdown.map((c) => (
              <div
                key={c.category}
                className="flex justify-between text-sm border-b py-1"
              >
                <span className="capitalize text-gray-600">{c.category}</span>
                <span className="font-medium">₹{c.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm font-medium text-gray-700 mb-2">Expense Log</p>

      {(deleteError || error) && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {deleteError || error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading expenses...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-sm">No expenses recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                {canDelete && <th></th>}
              </tr>
            </thead>
            <tbody>
              {items.map((exp) => (
                <tr key={exp._id} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="capitalize">{exp.category}</td>
                  <td>₹{exp.amount.toLocaleString()}</td>
                  <td className="text-gray-500">{exp.description || "—"}</td>
                  {canDelete && (
                    <td>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && canAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-sm bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
