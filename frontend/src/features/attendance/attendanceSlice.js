import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  markAttendance,
  getAttendanceByProject,
  updateAttendance,
} from "../../api/attendanceApi";

const rejectHelper = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchAttendanceByProject = createAsyncThunk(
  "attendance/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await getAttendanceByProject(projectId);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to fetch attendance"));
    }
  },
);

export const addAttendance = createAsyncThunk(
  "attendance/add",
  async (data, { rejectWithValue }) => {
    try {
      return await markAttendance(data);
    } catch (error) {
      return rejectWithValue(rejectHelper(error, "Failed to mark attendance"));
    }
  },
);

export const editAttendance = createAsyncThunk(
  "attendance/edit",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateAttendance(id, status);
    } catch (error) {
      return rejectWithValue(
        rejectHelper(error, "Failed to update attendance"),
      );
    }
  },
);

const initialState = {
  records: [],
  loading: false,
  error: null,
};

const replaceRecordInList = (records, updated) =>
  records.map((record) => (record._id === updated._id ? updated : record));

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.records = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload?.data || [];
      })
      .addCase(fetchAttendanceByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        const created = action.payload?.data;
        if (created) state.records.unshift(created);
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editAttendance.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated)
          state.records = replaceRecordInList(state.records, updated);
      })
      .addCase(editAttendance.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
