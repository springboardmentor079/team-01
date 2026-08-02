import axiosInstance from "./axiosInstance";

export const createResource = async (data) => {
  const response = await axiosInstance.post("/resources", data);
  return response.data;
};

export const getResources = async (params = {}) => {
  const response = await axiosInstance.get("/resources", { params });
  return response.data;
};

export const updateResource = async (id, updates) => {
  const response = await axiosInstance.put(`/resources/${id}`, updates);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axiosInstance.delete(`/resources/${id}`);
  return response.data;
};

export const allocateResource = async (id, projectId) => {
  const response = await axiosInstance.patch(`/resources/${id}/allocate`, {
    projectId,
  });
  return response.data;
};

export const unassignResource = async (id) => {
  const response = await axiosInstance.patch(`/resources/${id}/unassign`);
  return response.data;
};

export const setResourceMaintenance = async (id) => {
  const response = await axiosInstance.patch(`/resources/${id}/maintenance`);
  return response.data;
};

export const markResourceAvailable = async (id) => {
  const response = await axiosInstance.patch(`/resources/${id}/mark-available`);
  return response.data;
};
