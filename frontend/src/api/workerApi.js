import axiosInstance from "./axiosInstance";

export const createWorker = async (data) => {
  const response = await axiosInstance.post("/workers", data);
  return response.data;
};

export const getWorkers = async (params = {}) => {
  const response = await axiosInstance.get("/workers", { params });
  return response.data;
};

export const updateWorker = async (id, updates) => {
  const response = await axiosInstance.put(`/workers/${id}`, updates);
  return response.data;
};

export const deleteWorker = async (id) => {
  const response = await axiosInstance.delete(`/workers/${id}`);
  return response.data;
};
