import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as expenseApi from "../../api/expenseApi";

export const fetchExpensesByProject = createAsyncThunk(
  "expenses/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await expenseApi.getExpenses({ projectId });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch expenses",
      );
    }
  },
);

export const fetchBudgetSummary = createAsyncThunk(
  "expenses/fetchSummary",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await expenseApi.getBudgetSummary(projectId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch budget summary",
      );
    }
  },
);

export const addExpense = createAsyncThunk(
  "expenses/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await expenseApi.createExpense(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add expense",
      );
    }
  },
);

export const editExpense = createAsyncThunk(
  "expenses/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await expenseApi.updateExpense(id, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update expense",
      );
    }
  },
);

export const removeExpense = createAsyncThunk(
  "expenses/remove",
  async (id, { rejectWithValue }) => {
    try {
      await expenseApi.deleteExpense(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete expense",
      );
    }
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    summary: null,
    loading: false,
    summaryLoading: false,
    error: null,
  },
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchExpensesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.expenses;
      })
      .addCase(fetchExpensesByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // summary
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload;
      })
      // edit
      .addCase(editExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // remove
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
      });
  },
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
