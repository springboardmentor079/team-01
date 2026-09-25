import axiosInstance from "./axiosInstance";

export const markAttendance = async (data) => {
  const response = await axiosInstance.post("/attendance", data);
  return response.data;
};

export const getAttendanceByProject = async (projectId) => {
  const response = await axiosInstance.get(`/attendance/project/${projectId}`);
  return response.data;
};

export const updateAttendance = async (id, status) => {
  const response = await axiosInstance.put(`/attendance/${id}`, { status });
  return response.data;
};
