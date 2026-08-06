import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as procurementApi from "../../api/procurementApi";

export const fetchProcurements = createAsyncThunk(
  "procurement/fetchAll",
  async (params = {}) => {
    return await procurementApi.getAllProcurements(params);
  },
);

export const addProcurement = createAsyncThunk(
  "procurement/add",
  async (data) => {
    return await procurementApi.createProcurement(data);
  },
);

export const approveProcurementThunk = createAsyncThunk(
  "procurement/approve",
  async (id) => {
    return await procurementApi.approveProcurement(id);
  },
);

export const orderProcurementThunk = createAsyncThunk(
  "procurement/order",
  async (id) => {
    return await procurementApi.orderProcurement(id);
  },
);

export const deliverProcurementThunk = createAsyncThunk(
  "procurement/deliver",
  async ({ id, data }) => {
    return await procurementApi.deliverProcurement(id, data);
  },
);

export const cancelProcurementThunk = createAsyncThunk(
  "procurement/cancel",
  async ({ id, data }) => {
    return await procurementApi.cancelProcurement(id, data);
  },
);

const procurementSlice = createSlice({
  name: "procurement",
  initialState: {
    requests: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const updateOne = (state, action) => {
      const index = state.requests.findIndex(
        (r) => r._id === action.payload._id,
      );
      if (index !== -1) state.requests[index] = action.payload;
    };

    builder
      .addCase(fetchProcurements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProcurements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchProcurements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProcurement.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(approveProcurementThunk.fulfilled, updateOne)
      .addCase(orderProcurementThunk.fulfilled, updateOne)
      .addCase(deliverProcurementThunk.fulfilled, updateOne)
      .addCase(cancelProcurementThunk.fulfilled, updateOne);
  },
});

export default procurementSlice.reducer;
