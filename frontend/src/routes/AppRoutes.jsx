import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ProjectList from "../pages/projects/ProjectList";
import ProjectCreate from "../pages/projects/ProjectCreate";
import ProjectDetails from "../pages/projects/ProjectDetails";
import ProjectEdit from "../pages/projects/ProjectEdit";
import SiteProgressLog from "../pages/siteProgress/SiteProgressLog";
import ResourceAllocation from "../pages/resources/ResourceAllocation";
import WorkerManagement from "../pages/workers/WorkerManagement";
import AttendanceTracking from "../pages/attendance/AttendanceTracking";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/create" element={<ProjectCreate />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:id/edit" element={<ProjectEdit />} />
          <Route
            path="projects/:projectId/site-progress"
            element={<SiteProgressLog />}
          />
          <Route path="resources" element={<ResourceAllocation />} />
          <Route path="workers" element={<WorkerManagement />} />
          <Route path="attendance" element={<AttendanceTracking />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
