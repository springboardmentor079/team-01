import axiosInstance from "./axiosInstance";

export const createProcurement = async (data) => {
  const response = await axiosInstance.post("/procurement", data);
  return response.data;
};

export const getAllProcurements = async (params = {}) => {
  const response = await axiosInstance.get("/procurement", { params });
  return response.data;
};

export const getProcurementById = async (id) => {
  const response = await axiosInstance.get(`/procurement/${id}`);
  return response.data;
};

export const approveProcurement = async (id) => {
  const response = await axiosInstance.patch(`/procurement/${id}/approve`);
  return response.data;
};

export const orderProcurement = async (id) => {
  const response = await axiosInstance.patch(`/procurement/${id}/order`);
  return response.data;
};

export const deliverProcurement = async (id, data) => {
  const response = await axiosInstance.patch(
    `/procurement/${id}/deliver`,
    data,
  );
  return response.data;
};

export const cancelProcurement = async (id, data) => {
  const response = await axiosInstance.patch(`/procurement/${id}/cancel`, data);
  return response.data;
};
