import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResources,
  addResource,
  removeResource,
  allocateResourceThunk,
  unassignResourceThunk,
  setMaintenanceThunk,
  markAvailableThunk,
} from "../../features/resources/resourceSlice";
import { fetchProjects } from "../../features/projects/projectSlice";

const categoryOptions = [
  "Excavators",
  "Concrete Mixers",
  "Cranes",
  "Dump Trucks",
  "Generators",
  "Safety Equipment",
];

const statusStyles = {
  available: "bg-green-100 text-green-700",
  allocated: "bg-blue-100 text-blue-700",
  maintenance: "bg-amber-100 text-amber-700",
};

const ResourceAllocation = () => {
  const dispatch = useDispatch();
  const { resources, loading, error } = useSelector((state) => state.resources);
  const { projects } = useSelector((state) => state.projects);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Excavators" });
  const [statusFilter, setStatusFilter] = useState("");
  const [allocatingId, setAllocatingId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    dispatch(fetchResources(statusFilter ? { status: statusFilter } : {}));
    dispatch(fetchProjects({ page: 1, limit: 100 }));
  }, [dispatch, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (!form.name) return;

    try {
      await dispatch(addResource(form)).unwrap();
      setForm({ name: "", category: "Excavators" });
      setShowForm(false);
    } catch (submitError) {
      // error surfaces via Redux state
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this resource?")) {
      dispatch(removeResource(id));
    }
  };

  const handleAllocateClick = (resource) => {
    setAllocatingId(resource._id);
    setSelectedProjectId("");
  };

  const handleAllocateConfirm = async (resourceId) => {
    if (!selectedProjectId) return;
    try {
      await dispatch(
        allocateResourceThunk({ id: resourceId, projectId: selectedProjectId }),
      ).unwrap();
      setAllocatingId(null);
    } catch (allocateError) {
      // error surfaces via Redux state
    }
  };

  const handleUnassign = (id) => {
    dispatch(unassignResourceThunk(id));
  };

  const handleMaintenance = (id) => {
    dispatch(setMaintenanceThunk(id));
  };

  const handleMarkAvailable = (id) => {
    dispatch(markAvailableThunk(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Resource Allocation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage equipment availability and project assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Resource"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="e.g. Tower Crane TC-01"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Filter by status:
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading resources...
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {resources.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No resources found.
                </td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {resource.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {resource.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[resource.status]}`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {resource.projectId?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {resource.status === "available" && (
                        <>
                          {allocatingId === resource._id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedProjectId}
                                onChange={(e) =>
                                  setSelectedProjectId(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
                              >
                                <option value="">Select project</option>
                                {projects.map((project) => (
                                  <option key={project._id} value={project._id}>
                                    {project.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAllocateConfirm(resource._id)
                                }
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAllocateClick(resource)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Allocate
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMaintenance(resource._id)}
                            className="text-sm text-amber-600 hover:underline"
                          >
                            Maintenance
                          </button>
                        </>
                      )}
                      {resource.status === "allocated" && (
                        <button
                          type="button"
                          onClick={() => handleUnassign(resource._id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Unassign
                        </button>
                      )}
                      {resource.status === "maintenance" && (
                        <button
                          type="button"
                          onClick={() => handleMarkAvailable(resource._id)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Mark Available
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(resource._id)}
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

export default ResourceAllocation;
