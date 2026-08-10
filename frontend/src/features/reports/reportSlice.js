import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as reportApi from "../../api/reportApi";

export const fetchReport = createAsyncThunk(
  "reports/fetch",
  async ({ type, projectId }) => {
    return await reportApi.getReport(type, projectId);
  },
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearReport: (state) => {
      state.data = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearReport } = reportSlice.actions;
export default reportSlice.reducer;
