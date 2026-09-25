import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject,
} from "../../api/projectApi";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getProjects(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects",
      );
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProjectById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project",
      );
    }
  },
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      return await createProject(projectData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project",
      );
    }
  },
);

export const editProject = createAsyncThunk(
  "projects/editProject",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateProject(id, updates);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },
);

export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project",
      );
    }
  },
);

export const closeProjectThunk = createAsyncThunk(
  "projects/closeProjectThunk",
  async (id, { rejectWithValue }) => {
    try {
      return await closeProject(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to close project",
      );
    }
  },
);

const initialState = {
  projects: [],
  currentProject: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const replaceProjectInList = (projects, updatedProject) =>
  projects.map((project) =>
    project._id === updatedProject._id ? updatedProject : project,
  );

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload?.data?.projects || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload?.data || null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        const createdProject = action.payload?.data;
        if (createdProject) {
          state.projects.unshift(createdProject);
          state.totalCount += 1;
          state.currentProject = createdProject;
        }
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(editProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload?.data;
        if (updatedProject) {
          state.projects = replaceProjectInList(state.projects, updatedProject);
          if (state.currentProject?._id === updatedProject._id) {
            state.currentProject = updatedProject;
          }
        }
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.loading = false;
        const removedProjectId = action.payload;
        state.projects = state.projects.filter(
          (project) => project._id !== removedProjectId,
        );
        state.totalCount = Math.max(state.totalCount - 1, 0);
        if (state.currentProject?._id === removedProjectId) {
          state.currentProject = null;
        }
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(closeProjectThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeProjectThunk.fulfilled, (state, action) => {
        state.loading = false;
        const closedProject = action.payload?.data;
        if (closedProject) {
          state.projects = replaceProjectInList(state.projects, closedProject);
          if (state.currentProject?._id === closedProject._id) {
            state.currentProject = closedProject;
          }
        }
      })
      .addCase(closeProjectThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
