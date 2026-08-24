import axiosInstance from "./axiosInstance";

export const getPMDashboard = (projectId) =>
  axiosInstance.get(`/dashboard/pm/${projectId}`);

export const getAdminDashboard = () => axiosInstance.get("/dashboard/admin");
