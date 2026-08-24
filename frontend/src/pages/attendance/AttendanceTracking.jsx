import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkers } from "../../features/workers/workerSlice";
import { fetchProjects } from "../../features/projects/projectSlice";
import {
  fetchAttendanceByProject,
  addAttendance,
  editAttendance,
  clearAttendance,
} from "../../features/attendance/attendanceSlice";

const statusOptions = ["present", "absent", "half-day"];

const statusStyles = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  "half-day": "bg-amber-100 text-amber-700",
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

const todayInputDate = () => new Date().toISOString().split("T")[0];

const AttendanceTracking = () => {
  const dispatch = useDispatch();
  const { workers } = useSelector((state) => state.workers);
  const { projects } = useSelector((state) => state.projects);
  const { records, loading, error } = useSelector((state) => state.attendance);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [form, setForm] = useState({
    workerId: "",
    date: todayInputDate(),
    status: "present",
  });

  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchProjects({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchAttendanceByProject(selectedProjectId));
    } else {
      dispatch(clearAttendance());
    }
  }, [dispatch, selectedProjectId]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleMarkAttendance = async (event) => {
    event.preventDefault();

    if (!selectedProjectId || !form.workerId || !form.date) {
      return;
    }

    try {
      await dispatch(
        addAttendance({
          workerId: form.workerId,
          projectId: selectedProjectId,
          date: form.date,
          status: form.status,
        }),
      ).unwrap();
      setForm((current) => ({ ...current, workerId: "" }));
    } catch (submitError) {
      // error surfaces via Redux state (e.g. duplicate attendance for this day)
    }
  };

  const handleStatusChange = (recordId, newStatus) => {
    dispatch(editAttendance({ id: recordId, status: newStatus }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Attendance Tracking
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Mark and review daily attendance per project.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Project
        </label>
        <select
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">-- Choose a project --</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProjectId && (
        <>
          <form
            onSubmit={handleMarkAttendance}
            className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-4"
          >
            <select
              name="workerId"
              value={form.workerId}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select worker</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Mark Attendance
            </button>
          </form>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
              Loading attendance...
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {records.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No attendance records for this project yet.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {record.workerId?.name || "Unknown"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {record.workerId?.category || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(record.date)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <select
                          value={record.status}
                          onChange={(event) =>
                            handleStatusChange(record._id, event.target.value)
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusStyles[record.status]}`}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceTracking;
