import axiosInstance from "./axiosInstance";

export const getAllUsers = (params = {}) =>
  axiosInstance.get("/users", { params });
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
