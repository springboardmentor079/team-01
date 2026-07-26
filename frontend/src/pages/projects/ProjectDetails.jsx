import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  closeProjectThunk,
  removeProject,
  clearCurrentProject,
} from "../../features/projects/projectSlice";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(
    (state) => state.projects,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }

    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  const handleCloseProject = () => {
    if (!currentProject || currentProject.status === "closed") {
      return;
    }

    dispatch(closeProjectThunk(id));
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(removeProject(id)).unwrap();
      navigate("/dashboard/projects");
    } catch (deleteError) {
      // Error state is already handled in the slice.
    }
  };

  const isClosed = currentProject?.status === "closed";
  const teamMembers = Array.isArray(currentProject?.team)
    ? currentProject.team
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {currentProject?.name || "Project Details"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View project information, status, and team assignments.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/dashboard/projects/${id}/edit`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleCloseProject}
            disabled={isClosed || loading}
            className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isClosed ? "Project Closed" : "Close Project"}
          </button>
          <button
            type="button"
            onClick={handleDeleteProject}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading project details...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && currentProject && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Project Overview
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailItem label="Name" value={currentProject.name} />
                <DetailItem label="Category" value={currentProject.category} />
                <DetailItem label="Client" value={currentProject.client} />
                <DetailItem label="Status" value={currentProject.status} />
                <DetailItem
                  label="Budget"
                  value={
                    typeof currentProject.budget === "number"
                      ? currentProject.budget.toLocaleString()
                      : currentProject.budget
                  }
                />
                <DetailItem
                  label="Description"
                  value={currentProject.description || "N/A"}
                />
                <DetailItem
                  label="Start Date"
                  value={formatDate(currentProject.startDate)}
                />
                <DetailItem
                  label="End Date"
                  value={formatDate(currentProject.endDate)}
                />
                <DetailItem
                  label="Created At"
                  value={formatDate(currentProject.createdAt)}
                />
                <DetailItem
                  label="Updated At"
                  value={formatDate(currentProject.updatedAt)}
                />
                <DetailItem
                  label="Created By"
                  value={
                    currentProject.createdBy?.name ||
                    currentProject.createdBy ||
                    "N/A"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members
              </h2>
              <div className="mt-4 space-y-3">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <div
                      key={member._id || member.email || member.name}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <p className="font-medium text-gray-900">
                        {member.name || "Unnamed Member"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.email || "No email available"} ·{" "}
                        {member.role || "No role available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No team members assigned.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Status
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-900">
                    Current Status:
                  </span>{" "}
                  {currentProject.status}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Team Count:</span>{" "}
                  {teamMembers.length}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Timeline:</span>{" "}
                  {formatDate(currentProject.startDate)} -{" "}
                  {formatDate(currentProject.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !currentProject && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Project not found.
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

export default ProjectDetails;
