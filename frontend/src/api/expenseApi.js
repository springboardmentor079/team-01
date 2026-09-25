import axiosInstance from "./axiosInstance";

export const createExpense = (data) => axiosInstance.post("/expenses", data);

export const getExpenses = (params = {}) =>
  axiosInstance.get("/expenses", { params });

export const getExpenseById = (id) => axiosInstance.get(`/expenses/${id}`);

export const updateExpense = (id, data) =>
  axiosInstance.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => axiosInstance.delete(`/expenses/${id}`);

export const getBudgetSummary = (projectId) =>
  axiosInstance.get(`/expenses/project/${projectId}/summary`);
