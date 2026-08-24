import axiosInstance from "./axiosInstance";

export const uploadDocument = async ({
  file,
  projectId,
  entityType,
  entityId,
}) => {
  const formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("entityType", entityType);
  formData.append("entityId", entityId);
  formData.append("file", file);

  const response = await axiosInstance.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDocumentsForEntity = async (entityType, entityId) => {
  const response = await axiosInstance.get("/documents", {
    params: { entityType, entityId },
  });
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await axiosInstance.delete(`/documents/${id}`);
  return response.data;
};
