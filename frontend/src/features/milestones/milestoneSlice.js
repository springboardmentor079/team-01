import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  deleteMilestone,
} from "../../api/milestoneApi";

export const fetchMilestonesByProject = createAsyncThunk(
  "milestones/fetchMilestonesByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await getMilestonesByProject(projectId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch milestones",
      );
    }
  },
);

export const addMilestone = createAsyncThunk(
  "milestones/addMilestone",
  async (milestoneData, { rejectWithValue }) => {
    try {
      return await createMilestone(milestoneData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create milestone",
      );
    }
  },
);

export const editMilestone = createAsyncThunk(
  "milestones/editMilestone",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateMilestone(id, updates);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update milestone",
      );
    }
  },
);

export const removeMilestone = createAsyncThunk(
  "milestones/removeMilestone",
  async (id, { rejectWithValue }) => {
    try {
      await deleteMilestone(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete milestone",
      );
    }
  },
);

const initialState = {
  milestones: [],
  loading: false,
  error: null,
};

const replaceMilestoneInList = (milestones, updatedMilestone) =>
  milestones.map((milestone) =>
    milestone._id === updatedMilestone._id ? updatedMilestone : milestone,
  );

const milestoneSlice = createSlice({
  name: "milestones",
  initialState,
  reducers: {
    clearMilestones: (state) => {
      state.milestones = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilestonesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestonesByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = action.payload?.data || [];
      })
      .addCase(fetchMilestonesByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.data;
        if (created) {
          state.milestones.push(created);
        }
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        if (updated) {
          state.milestones = replaceMilestoneInList(state.milestones, updated);
        }
      })
      .addCase(editMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        state.milestones = state.milestones.filter(
          (milestone) => milestone._id !== removedId,
        );
      })
      .addCase(removeMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMilestones } = milestoneSlice.actions;
export default milestoneSlice.reducer;
