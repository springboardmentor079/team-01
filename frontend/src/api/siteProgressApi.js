import axiosInstance from "./axiosInstance";

export const createSiteProgress = async (data) => {
  const response = await axiosInstance.post("/site-progress", data);
  return response.data;
};

export const getSiteProgressByProject = async (projectId) => {
  const response = await axiosInstance.get(
    `/site-progress/project/${projectId}`,
  );
  return response.data;
};

export const updateSiteProgress = async (id, updates) => {
  const response = await axiosInstance.put(`/site-progress/${id}`, updates);
  return response.data;
};

export const deleteSiteProgress = async (id) => {
  const response = await axiosInstance.delete(`/site-progress/${id}`);
  return response.data;
};
