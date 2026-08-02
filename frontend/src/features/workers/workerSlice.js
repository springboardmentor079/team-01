import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
} from "../../api/workerApi";

const rejectHelper = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchWorkers = createAsyncThunk(
  "workers/fetch",
  async (params, { rejectWithValue }) => {
    try {
      return await getWorkers(params);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to fetch workers"));
    }
  },
);

export const addWorker = createAsyncThunk(
  "workers/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createWorker(data);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to create worker"));
    }
  },
);

export const editWorker = createAsyncThunk(
  "workers/edit",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateWorker(id, updates);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to update worker"));
    }
  },
);

export const removeWorker = createAsyncThunk(
  "workers/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteWorker(id);
      return id;
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to delete worker"));
    }
  },
);

const initialState = {
  workers: [],
  loading: false,
  error: null,
};

const replaceWorkerInList = (workers, updated) =>
  workers.map((worker) => (worker._id === updated._id ? updated : worker));

const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload?.data || [];
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addWorker.fulfilled, (state, action) => {
        const created = action.payload?.data;
        if (created) state.workers.unshift(created);
      })
      .addCase(addWorker.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editWorker.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.workers = replaceWorkerInList(state.workers, updated);
      })
      .addCase(editWorker.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeWorker.fulfilled, (state, action) => {
        state.workers = state.workers.filter((w) => w._id !== action.payload);
      })
      .addCase(removeWorker.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default workerSlice.reducer;
