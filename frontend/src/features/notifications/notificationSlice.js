import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationApi from "../../api/notificationApi";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async () => {
    return await notificationApi.getMyNotifications();
  },
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id) => {
    return await notificationApi.markNotificationAsRead(id);
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async () => {
    await notificationApi.markAllNotificationsAsRead();
    return true;
  },
);

export const deleteNotificationThunk = createAsyncThunk(
  "notifications/delete",
  async (id) => {
    await notificationApi.deleteNotification(id);
    return id;
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (n) => n._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      });
  },
});

export default notificationSlice.reducer;
