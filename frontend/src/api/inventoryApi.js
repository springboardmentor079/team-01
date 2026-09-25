import axiosInstance from "./axiosInstance";

export const createInventory = async (data) => {
  const response = await axiosInstance.post("/inventory", data);
  return response.data;
};

export const getInventoryByProject = async (projectId) => {
  const response = await axiosInstance.get(`/inventory/project/${projectId}`);
  return response.data;
};

export const getInventoryById = async (id) => {
  const response = await axiosInstance.get(`/inventory/${id}`);
  return response.data;
};

export const updateInventory = async (id, data) => {
  const response = await axiosInstance.put(`/inventory/${id}`, data);
  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await axiosInstance.delete(`/inventory/${id}`);
  return response.data;
};

export const restockItem = async (id, data) => {
  const response = await axiosInstance.post(`/inventory/${id}/restock`, data);
  return response.data;
};

export const consumeItem = async (id, data) => {
  const response = await axiosInstance.post(`/inventory/${id}/consume`, data);
  return response.data;
};

export const adjustStock = async (id, data) => {
  const response = await axiosInstance.post(`/inventory/${id}/adjust`, data);
  return response.data;
};

export const getInventoryLogs = async (id) => {
  const response = await axiosInstance.get(`/inventory/${id}/logs`);
  return response.data;
};

export const getAllInventory = async (params = {}) => {
  const response = await axiosInstance.get("/inventory", { params });
  return response.data;
};
