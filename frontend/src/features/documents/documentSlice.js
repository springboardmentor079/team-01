import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as documentApi from "../../api/documentApi";

export const fetchDocumentsForEntity = createAsyncThunk(
  "documents/fetchForEntity",
  async ({ entityType, entityId }) => {
    return await documentApi.getDocumentsForEntity(entityType, entityId);
  },
);

export const uploadDocumentThunk = createAsyncThunk(
  "documents/upload",
  async ({ file, projectId, entityType, entityId }) => {
    return await documentApi.uploadDocument({
      file,
      projectId,
      entityType,
      entityId,
    });
  },
);

export const deleteDocumentThunk = createAsyncThunk(
  "documents/delete",
  async (id) => {
    await documentApi.deleteDocument(id);
    return id;
  },
);

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    items: [],
    status: "idle",
    uploading: false,
    error: null,
  },
  reducers: {
    clearDocuments: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsForEntity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDocumentsForEntity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDocumentsForEntity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(uploadDocumentThunk.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadDocumentThunk.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadDocumentThunk.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((doc) => doc._id !== action.payload);
      });
  },
});

export const { clearDocuments } = documentSlice.actions;
export default documentSlice.reducer;
