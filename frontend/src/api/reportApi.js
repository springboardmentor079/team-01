import axiosInstance from "./axiosInstance";

export const getReport = async (type, projectId) => {
  const params = projectId ? { projectId } : {};
  const response = await axiosInstance.get(`/reports/${type}`, { params });
  return response.data;
};

export const downloadReportExport = async (type, format, projectId) => {
  const params = { format, ...(projectId ? { projectId } : {}) };
  const response = await axiosInstance.get(`/reports/${type}/export`, {
    params,
    responseType: "blob",
  });
  return response.data;
};
