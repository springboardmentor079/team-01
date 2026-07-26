import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProject } from "../../features/projects/projectSlice";

const initialFormState = {
  name: "",
  category: "Residential",
  description: "",
  client: "",
  startDate: "",
  endDate: "",
  budget: "",
};

const categoryOptions = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Government",
];

const ProjectCreate = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.projects);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "category",
      "client",
      "startDate",
      "endDate",
      "budget",
    ];
    const missingField = requiredFields.find((field) => !formData[field]);

    if (missingField) {
      setFormError("Please fill out all required fields.");
      return false;
    }

    if (Number.isNaN(Number(formData.budget)) || Number(formData.budget) < 0) {
      setFormError("Budget must be a number greater than or equal to 0.");
      return false;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError("End date must be greater than or equal to start date.");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        addProject({
          ...formData,
          budget: Number(formData.budget),
        }),
      ).unwrap();

      navigate("/projects");
    } catch (submitError) {
      // Redux slice handles the error state; keep local flow quiet here.
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create Project
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new construction project to the system.
        </p>
      </div>

      {(formError || error) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError || error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Project name"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Project description"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="client"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Client <span className="text-red-500">*</span>
            </label>
            <input
              id="client"
              name="client"
              type="text"
              value={formData.client}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Client or owner name"
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Budget <span className="text-red-500">*</span>
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreate;
