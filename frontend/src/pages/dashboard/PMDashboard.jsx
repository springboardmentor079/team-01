import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchPMDashboard } from "../../features/dashboard/dashboardSlice";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function PMDashboard() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { pmData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (projectId) dispatch(fetchPMDashboard(projectId));
  }, [dispatch, projectId]);

  if (loading) return <p className="text-gray-500 p-6">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!pmData) return null;

  const { project, progress, budget, resources, workforce, procurement } =
    pmData;

  const milestonePieData = [
    { name: "Completed", value: progress.milestones.completed },
    {
      name: "Remaining",
      value: progress.milestones.total - progress.milestones.completed,
    },
  ];

  const budgetBarData = [
    { name: "Planned", amount: budget.plannedBudget },
    { name: "Actual", amount: budget.actualSpend },
  ];

  const categoryBarData = budget.categoryBreakdown.map((c) => ({
    name: c.category,
    amount: c.total,
  }));

  const resourceBarData = resources.byStatus.map((r) => ({
    name: r.status,
    count: r.count,
  }));

  const attendanceBarData = workforce.attendanceLast7Days.map((a) => ({
    name: a.status,
    count: a.count,
  }));

  const procurementBarData = procurement.byStatus.map((p) => ({
    name: p.status,
    count: p.count,
    amount: p.totalAmount,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
        <p className="text-sm text-gray-500 capitalize">
          {project.category} · {project.status}
        </p>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard
          label="Milestones"
          value={`${progress.milestones.completed}/${progress.milestones.total}`}
          sub={`${progress.milestones.overdue} overdue`}
          color="blue"
        />
        <SummaryCard
          label="Budget Used"
          value={
            budget.utilizationPercent !== null
              ? `${budget.utilizationPercent}%`
              : "N/A"
          }
          sub={`₹${budget.remaining.toLocaleString()} remaining`}
          color={budget.remaining < 0 ? "red" : "green"}
        />
        <SummaryCard
          label="Delays Logged"
          value={progress.delayCount}
          sub="site progress reports"
          color="amber"
        />
        <SummaryCard
          label="Open Procurements"
          value={
            procurement.byStatus.find((p) => p.status !== "delivered")?.count ??
            0
          }
          sub="pending / in-progress"
          color="purple"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Milestone Completion">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={milestonePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {milestonePieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Planned vs Actual Budget">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spend by Category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Resource Allocation">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={resourceBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance (Last 7 Days)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Procurement Status">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={procurementBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0891b2" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1 opacity-80">{sub}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      {children}
    </div>
  );
}
