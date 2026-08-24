import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as inventoryApi from "../../api/inventoryApi";

export const fetchInventory = createAsyncThunk(
  "inventory/fetchAll",
  async (params = {}) => {
    return await inventoryApi.getAllInventory(params);
  },
);

export const addInventoryItem = createAsyncThunk(
  "inventory/add",
  async (data) => {
    return await inventoryApi.createInventory(data);
  },
);

export const editInventoryItem = createAsyncThunk(
  "inventory/edit",
  async ({ id, data }) => {
    return await inventoryApi.updateInventory(id, data);
  },
);

export const removeInventoryItem = createAsyncThunk(
  "inventory/remove",
  async (id) => {
    await inventoryApi.deleteInventory(id);
    return id;
  },
);

export const restockInventoryItem = createAsyncThunk(
  "inventory/restock",
  async ({ id, data }) => {
    return await inventoryApi.restockItem(id, data);
  },
);

export const consumeInventoryItem = createAsyncThunk(
  "inventory/consume",
  async ({ id, data }) => {
    return await inventoryApi.consumeItem(id, data);
  },
);

export const adjustInventoryStock = createAsyncThunk(
  "inventory/adjust",
  async ({ id, data }) => {
    return await inventoryApi.adjustStock(id, data);
  },
);

export const fetchInventoryLogs = createAsyncThunk(
  "inventory/fetchLogs",
  async (id) => {
    return await inventoryApi.getInventoryLogs(id);
  },
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    logs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(restockInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(consumeInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(adjustInventoryStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchInventoryLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
      });
  },
});

export default inventorySlice.reducer;
