import axiosInstance from "./axiosInstance";

export const createMilestone = async (milestoneData) => {
  const response = await axiosInstance.post("/milestones", milestoneData);
  return response.data;
};

export const getMilestonesByProject = async (projectId) => {
  const response = await axiosInstance.get(`/milestones/project/${projectId}`);
  return response.data;
};

export const updateMilestone = async (id, updates) => {
  const response = await axiosInstance.put(`/milestones/${id}`, updates);
  return response.data;
};

export const deleteMilestone = async (id) => {
  const response = await axiosInstance.delete(`/milestones/${id}`);
  return response.data;
};
