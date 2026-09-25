import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as vendorApi from "../../api/vendorApi";

export const fetchVendors = createAsyncThunk("vendors/fetchAll", async () => {
  return await vendorApi.getAllVendors();
});

export const addVendor = createAsyncThunk("vendors/add", async (data) => {
  return await vendorApi.createVendor(data);
});

export const editVendor = createAsyncThunk(
  "vendors/edit",
  async ({ id, data }) => {
    return await vendorApi.updateVendor(id, data);
  },
);

export const removeVendor = createAsyncThunk("vendors/remove", async (id) => {
  await vendorApi.deleteVendor(id);
  return id;
});

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors.push(action.payload);
      })
      .addCase(editVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(
          (v) => v._id === action.payload._id,
        );
        if (index !== -1) state.vendors[index] = action.payload;
      })
      .addCase(removeVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter((v) => v._id !== action.payload);
      });
  },
});

export default vendorSlice.reducer;
