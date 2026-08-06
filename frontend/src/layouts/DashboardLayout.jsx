import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const role = user?.role;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getNavLinks = () => {
    if (role === "admin") {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Projects", to: "/dashboard/projects" },
        { label: "Users", to: "/users" },
        { label: "Resources", to: "/dashboard/resources" },
        { label: "Workers", to: "/dashboard/workers" },
        { label: "Attendance", to: "/dashboard/attendance" },
        { label: "Inventory", to: "/dashboard/inventory" },
        { label: "Vendors", to: "/dashboard/vendors" },
        { label: "Procurement", to: "/dashboard/procurement" },
      ];
    }

    if (role === "project_manager") {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Projects", to: "/dashboard/projects" },
        { label: "Resources", to: "/dashboard/resources" },
        { label: "Workers", to: "/dashboard/workers" },
        { label: "Attendance", to: "/dashboard/attendance" },
        { label: "Inventory", to: "/dashboard/inventory" },
        { label: "Vendors", to: "/dashboard/vendors" },
        { label: "Procurement", to: "/dashboard/procurement" },
      ];
    }

    return [{ label: "Dashboard", to: "/dashboard" }];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white">
        <div className="border-b border-gray-800 px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">BuildTrack</h1>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {role || "guest"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm Logout
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
