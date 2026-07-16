import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-gray-200/70">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
