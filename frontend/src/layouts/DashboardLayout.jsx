import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getNavLinks = () => {
    if (role === "admin") {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Users", to: "/users" },
      ];
    }

    if (role === "project_manager") {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Projects", to: "/projects" },
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
              onClick={handleLogout}
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
    </div>
  );
};

export default DashboardLayout;
