import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left: image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/construction-site.jpg"
          alt="Construction site"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/10" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold tracking-tight">BuildTrack</h1>
          <p className="mt-3 text-lg text-gray-200 max-w-md">
            One platform to manage every project, every site, every team.
          </p>
        </div>
      </div>

      {/* Right: form panel — scrolls independently */}
      <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center bg-gray-50 px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
