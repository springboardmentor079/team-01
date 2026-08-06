import axiosInstance from "./axiosInstance";

export const createVendor = async (data) => {
  const response = await axiosInstance.post("/vendors", data);
  return response.data;
};

export const getAllVendors = async () => {
  const response = await axiosInstance.get("/vendors");
  return response.data;
};

export const getVendorById = async (id) => {
  const response = await axiosInstance.get(`/vendors/${id}`);
  return response.data;
};

export const updateVendor = async (id, data) => {
  const response = await axiosInstance.put(`/vendors/${id}`, data);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await axiosInstance.delete(`/vendors/${id}`);
  return response.data;
};
