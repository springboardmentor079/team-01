import axiosInstance from "./axiosInstance";

export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};
