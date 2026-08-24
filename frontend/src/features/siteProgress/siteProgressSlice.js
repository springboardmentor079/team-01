import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createSiteProgress,
  getSiteProgressByProject,
  updateSiteProgress,
  deleteSiteProgress,
} from "../../api/siteProgressApi";

export const fetchSiteProgressByProject = createAsyncThunk(
  "siteProgress/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await getSiteProgressByProject(projectId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports",
      );
    }
  },
);

export const addSiteProgress = createAsyncThunk(
  "siteProgress/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createSiteProgress(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create report",
      );
    }
  },
);

export const editSiteProgress = createAsyncThunk(
  "siteProgress/edit",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateSiteProgress(id, updates);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update report",
      );
    }
  },
);

export const removeSiteProgress = createAsyncThunk(
  "siteProgress/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSiteProgress(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report",
      );
    }
  },
);

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

const replaceReportInList = (reports, updated) =>
  reports.map((report) => (report._id === updated._id ? updated : report));

const siteProgressSlice = createSlice({
  name: "siteProgress",
  initialState,
  reducers: {
    clearSiteProgress: (state) => {
      state.reports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteProgressByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteProgressByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload?.data || [];
      })
      .addCase(fetchSiteProgressByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSiteProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSiteProgress.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.data;
        if (created) {
          state.reports.unshift(created);
        }
      })
      .addCase(addSiteProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editSiteProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSiteProgress.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        if (updated) {
          state.reports = replaceReportInList(state.reports, updated);
        }
      })
      .addCase(editSiteProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeSiteProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSiteProgress.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        state.reports = state.reports.filter(
          (report) => report._id !== removedId,
        );
      })
      .addCase(removeSiteProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSiteProgress } = siteProgressSlice.actions;
export default siteProgressSlice.reducer;
