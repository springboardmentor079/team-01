import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../features/reports/reportSlice";
import { fetchProjects } from "../../features/projects/projectSlice";
import { downloadReportExport } from "../../api/reportApi";

const reportTypes = [
  { value: "progress", label: "Site Progress" },
  { value: "resource", label: "Resource Utilization" },
  { value: "workforce", label: "Workforce" },
  { value: "procurement", label: "Procurement" },
];

const formatLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.reports);
  const { projects } = useSelector((state) => state.projects);

  const [reportType, setReportType] = useState("progress");
  const [projectFilter, setProjectFilter] = useState("");
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchReport({ type: reportType, projectId: projectFilter || undefined }),
    );
  }, [dispatch, reportType, projectFilter]);

  const handleExport = async (format) => {
    setExporting(format);
    try {
      const blob = await downloadReportExport(
        reportType,
        format,
        projectFilter || undefined,
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const extension = format === "pdf" ? "pdf" : "xlsx";
      link.href = url;
      link.setAttribute("download", `${reportType}-report.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      // could surface a toast here if you have one
    } finally {
      setExporting(null);
    }
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0)
        return <p className="text-sm text-gray-500">None</p>;
      return (
        <ul className="mt-1 space-y-1">
          {value.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
            >
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">{subKey}</p>
              <p className="text-sm font-semibold text-gray-900">
                {String(subValue)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-lg font-semibold text-gray-900">{String(value)}</p>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Summarized data across projects, exportable as PDF or Excel.
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {exporting === "pdf" ? "Exporting..." : "Export PDF"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("excel")}
            disabled={exporting !== null}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {exporting === "excel" ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading report...
        </div>
      )}

      {!loading && data && (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <p className="text-sm font-semibold text-gray-700">
                {formatLabel(key)}
              </p>
              {renderValue(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
