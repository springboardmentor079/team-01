import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dashboardApi from "../../api/dashboardApi";

export const fetchPMDashboard = createAsyncThunk(
  "dashboard/fetchPM",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getPMDashboard(projectId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getAdminDashboard();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin dashboard",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    pmData: null,
    adminData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPMDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPMDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.pmData = action.payload;
      })
      .addCase(fetchPMDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
