import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchAdminDashboard } from "../../features/dashboard/dashboardSlice";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { adminData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  if (loading) return <p className="text-gray-500 p-6">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  if (!adminData) return null;

  const { users, projects, systemAnalytics, activityLog } = adminData;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total Users" value={users.total} color="blue" />
        <SummaryCard
          label="Total Projects"
          value={projects.total}
          color="green"
        />
        <SummaryCard
          label="Total Spend (All Projects)"
          value={`₹${systemAnalytics.totalSpendAllProjects.toLocaleString()}`}
          color="amber"
        />
        <SummaryCard
          label="Low Stock Items"
          value={systemAnalytics.lowStockItems}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Users by Role">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={users.byRole}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {users.byRole.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Projects by Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projects.byStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {projects.byStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Projects by Category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={projects.byCategory.map((c) => ({
                name: c.category,
                count: c.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Procurement by Status">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={systemAnalytics.procurement.map((p) => ({
                name: p.status,
                count: p.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Recent Activity
        </p>
        {activityLog.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity yet.</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {activityLog.map((a) => (
              <li key={a.id} className="text-sm border-b pb-2 last:border-0">
                <span className="text-gray-800">{a.message}</span>
                <span className="text-gray-400 text-xs ml-2">
                  {a.user ? `— ${a.user.name} (${a.user.role})` : ""} ·{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
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
