import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSiteProgressByProject,
  addSiteProgress,
  editSiteProgress,
  removeSiteProgress,
  clearSiteProgress,
} from "../../features/siteProgress/siteProgressSlice";

const categoryOptions = [
  "Foundation",
  "Structural",
  "Electrical",
  "Plumbing",
  "Finishing",
  "Inspection",
];

const initialForm = {
  category: "Foundation",
  date: "",
  description: "",
  delayed: false,
  reason: "",
  revisedDate: "",
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const SiteProgressLog = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector(
    (state) => state.siteProgress,
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchSiteProgressByProject(projectId));
    }
    return () => {
      dispatch(clearSiteProgress());
    };
  }, [dispatch, projectId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.category || !form.date || !form.description) {
      return;
    }

    const payload = {
      projectId,
      category: form.category,
      date: form.date,
      description: form.description,
      delay: {
        delayed: form.delayed,
        reason: form.delayed ? form.reason : "",
        revisedDate: form.delayed && form.revisedDate ? form.revisedDate : null,
      },
    };

    try {
      if (editingId) {
        await dispatch(
          editSiteProgress({ id: editingId, updates: payload }),
        ).unwrap();
      } else {
        await dispatch(addSiteProgress(payload)).unwrap();
      }
      resetForm();
    } catch (submitError) {
      // error shown via Redux state
    }
  };

  const handleEditClick = (report) => {
    setEditingId(report._id);
    setForm({
      category: report.category,
      date: toInputDate(report.date),
      description: report.description,
      delayed: report.delay?.delayed || false,
      reason: report.delay?.reason || "",
      revisedDate: toInputDate(report.delay?.revisedDate),
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this site progress report?")) {
      dispatch(removeSiteProgress(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Site Progress Log
          </h1>
          <Link
            to={`/dashboard/projects/${projectId}`}
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            &larr; Back to project
          </Link>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Report"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
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
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the progress..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="delayed"
              checked={form.delayed}
              onChange={handleChange}
            />
            This report involves a delay
          </label>

          {form.delayed && (
            <div className="grid gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 md:grid-cols-2">
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Delay reason"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                name="revisedDate"
                value={form.revisedDate}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {editingId ? "Update Report" : "Submit Report"}
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
          Loading reports...
        </div>
      )}

      <div className="space-y-3">
        {!loading && reports.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
            No site progress reports yet.
          </div>
        )}

        {reports.map((report) => (
          <div
            key={report._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {report.category} &middot; {formatDate(report.date)}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {report.description}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Submitted by {report.submittedBy?.name || "Unknown"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleEditClick(report)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(report._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {report.delay?.delayed && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <strong>Delayed:</strong>{" "}
                {report.delay.reason || "No reason given"}{" "}
                {report.delay.revisedDate && (
                  <>
                    &middot; Revised date:{" "}
                    {formatDate(report.delay.revisedDate)}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteProgressLog;
