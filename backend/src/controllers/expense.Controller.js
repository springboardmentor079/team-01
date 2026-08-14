const Expense = require("../models/Expense");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

// POST /api/expenses
const createExpense = asyncHandler(async (req, res) => {
  const { projectId, category, amount, date, description } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return apiResponse(res, 404, false, "Project not found");
  }

  const expense = await Expense.create({
    projectId,
    category,
    amount,
    date,
    description,
    createdBy: req.user.id,
  });

  return apiResponse(res, 201, true, "Expense recorded", expense);
});

// GET /api/expenses?projectId=&category=&page=&limit=
const getExpenses = asyncHandler(async (req, res) => {
  const { projectId, category, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (projectId) filter.projectId = projectId;
  if (category) filter.category = category;

  const expenses = await Expense.find(filter)
    .populate("projectId", "name")
    .populate("createdBy", "name email")
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Expense.countDocuments(filter);

  return apiResponse(res, 200, true, "Expenses fetched", {
    expenses,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/expenses/:id
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)
    .populate("projectId", "name")
    .populate("createdBy", "name email");

  if (!expense) {
    return apiResponse(res, 404, false, "Expense not found");
  }

  return apiResponse(res, 200, true, "Expense fetched", expense);
});

// PUT /api/expenses/:id — whitelisted fields only
const updateExpense = asyncHandler(async (req, res) => {
  const { category, amount, date, description } = req.body;

  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    { category, amount, date, description },
    { new: true, runValidators: true },
  );

  if (!expense) {
    return apiResponse(res, 404, false, "Expense not found");
  }

  return apiResponse(res, 200, true, "Expense updated", expense);
});

// DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    return apiResponse(res, 404, false, "Expense not found");
  }

  return apiResponse(res, 200, true, "Expense deleted", null);
});

// GET /api/expenses/project/:projectId/summary — planned vs actual + category breakdown
const getBudgetSummary = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).select("name budget");
  if (!project) {
    return apiResponse(res, 404, false, "Project not found");
  }

  const breakdown = await Expense.aggregate([
    { $match: { projectId: project._id } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);

  const actualSpend = breakdown.reduce((sum, c) => sum + c.total, 0);
  const plannedBudget = project.budget || 0;

  return apiResponse(res, 200, true, "Budget summary fetched", {
    projectId: project._id,
    projectName: project.name,
    plannedBudget,
    actualSpend,
    remaining: plannedBudget - actualSpend,
    utilizationPercent:
      plannedBudget > 0
        ? Number(((actualSpend / plannedBudget) * 100).toFixed(1))
        : null,
    categoryBreakdown: breakdown.map((c) => ({
      category: c._id,
      total: c.total,
    })),
  });
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
};
