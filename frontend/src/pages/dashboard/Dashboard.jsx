import { useSelector } from "react-redux";

const cards = [
  {
    title: "Projects Overview",
    description: "project progress and summary metrics.",
  },
  {
    title: "Recent Activity",
    description: "latest updates and actions.",
  },
  {
    title: "Notifications",
    description: "alerts and reminders.",
  },
  {
    title: "Status Snapshot",
    description: "quick status indicators.",
  },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome, {user?.name || "User"}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {card.description}
            </p>
            <div className="mt-6 h-24 rounded-xl border border-dashed border-gray-200 bg-gray-50" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
