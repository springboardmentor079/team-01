import axiosInstance from "./axiosInstance";

export const createProject = async (projectData) => {
  const response = await axiosInstance.post("/projects", projectData);
  return response.data;
};

export const getProjects = async (params = {}) => {
  const response = await axiosInstance.get("/projects", { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id, updates) => {
  const response = await axiosInstance.put(`/projects/${id}`, updates);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};

export const closeProject = async (id) => {
  const response = await axiosInstance.patch(`/projects/${id}/close`);
  return response.data;
};
