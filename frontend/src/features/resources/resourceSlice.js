import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  allocateResource,
  unassignResource,
  setResourceMaintenance,
  markResourceAvailable,
} from "../../api/resourceApi";

const rejectHelper = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchResources = createAsyncThunk(
  "resources/fetch",
  async (params, { rejectWithValue }) => {
    try {
      return await getResources(params);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to fetch resources"));
    }
  },
);

export const addResource = createAsyncThunk(
  "resources/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createResource(data);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to create resource"));
    }
  },
);

export const editResource = createAsyncThunk(
  "resources/edit",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateResource(id, updates);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to update resource"));
    }
  },
);

export const removeResource = createAsyncThunk(
  "resources/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteResource(id);
      return id;
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to delete resource"));
    }
  },
);

export const allocateResourceThunk = createAsyncThunk(
  "resources/allocate",
  async ({ id, projectId }, { rejectWithValue }) => {
    try {
      return await allocateResource(id, projectId);
    } catch (error) {
      return rejectWithValue(
        rejectHelper(error, "Failed to allocate resource"),
      );
    }
  },
);

export const unassignResourceThunk = createAsyncThunk(
  "resources/unassign",
  async (id, { rejectWithValue }) => {
    try {
      return await unassignResource(id);
    } catch (error) {
      return rejectWithValue(
        rejectHelper(error, "Failed to unassign resource"),
      );
    }
  },
);

export const setMaintenanceThunk = createAsyncThunk(
  "resources/maintenance",
  async (id, { rejectWithValue }) => {
    try {
      return await setResourceMaintenance(id);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to set maintenance"));
    }
  },
);

export const markAvailableThunk = createAsyncThunk(
  "resources/markAvailable",
  async (id, { rejectWithValue }) => {
    try {
      return await markResourceAvailable(id);
    } catch (error) {
      return rejectWithValue(
        rejectHelper(error, "Failed to mark resource available"),
      );
    }
  },
);

const initialState = {
  resources: [],
  loading: false,
  error: null,
};

const replaceResourceInList = (resources, updated) =>
  resources.map((resource) =>
    resource._id === updated._id ? updated : resource,
  );

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload?.data || [];
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addResource.fulfilled, (state, action) => {
        const created = action.payload?.data;
        if (created) state.resources.unshift(created);
      })
      .addCase(addResource.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editResource.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.resources = replaceResourceInList(state.resources, updated);
      })
      .addCase(editResource.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(
          (r) => r._id !== action.payload,
        );
      })
      .addCase(removeResource.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(allocateResourceThunk.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.resources = replaceResourceInList(state.resources, updated);
      })
      .addCase(allocateResourceThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unassignResourceThunk.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.resources = replaceResourceInList(state.resources, updated);
      })
      .addCase(unassignResourceThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(setMaintenanceThunk.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.resources = replaceResourceInList(state.resources, updated);
      })
      .addCase(setMaintenanceThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAvailableThunk.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.resources = replaceResourceInList(state.resources, updated);
      })
      .addCase(markAvailableThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default resourceSlice.reducer;
