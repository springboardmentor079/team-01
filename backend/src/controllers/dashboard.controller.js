const Project = require("../models/Project");
const Milestone = require("../models/Milestone");
const SiteProgress = require("../models/SiteProgress");
const Resource = require("../models/Resource");
const Attendance = require("../models/Attendance");
const Procurement = require("../models/Procurement");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

// GET /api/dashboard/pm/:projectId
const getPMDashboard = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).select(
    "name status category budget startDate endDate",
  );
  if (!project) {
    return apiResponse(res, 404, false, "Project not found");
  }

  const [
    milestoneStats,
    latestProgress,
    delayCount,
    resourceStats,
    attendanceStats,
    procurementStats,
    expenseBreakdown,
  ] = await Promise.all([
    // Milestones: total vs completed vs overdue
    Milestone.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "completed"] },
                    { $lt: ["$targetDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),

    // Most recent site progress report
    SiteProgress.findOne({ projectId })
      .sort({ date: -1 })
      .select("category date description delay"),

    // Total logged delays
    SiteProgress.countDocuments({
      projectId,
      "delay.reason": { $exists: true, $ne: null },
    }),

    // Resource allocation status breakdown
    Resource.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Attendance — last 7 days
    Attendance.aggregate([
      {
        $match: {
          projectId: project._id,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Procurement status breakdown
    Procurement.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),

    // Budget: reuse the same aggregation as getBudgetSummary
    Expense.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
  ]);

  const actualSpend = expenseBreakdown.reduce((sum, c) => sum + c.total, 0);
  const plannedBudget = project.budget || 0;

  return apiResponse(res, 200, true, "PM dashboard data fetched", {
    project: {
      id: project._id,
      name: project.name,
      status: project.status,
      category: project.category,
      startDate: project.startDate,
      endDate: project.endDate,
    },
    progress: {
      milestones: milestoneStats[0] || { total: 0, completed: 0, overdue: 0 },
      latestReport: latestProgress || null,
      delayCount,
    },
    budget: {
      plannedBudget,
      actualSpend,
      remaining: plannedBudget - actualSpend,
      utilizationPercent:
        plannedBudget > 0
          ? Number(((actualSpend / plannedBudget) * 100).toFixed(1))
          : null,
      categoryBreakdown: expenseBreakdown.map((c) => ({
        category: c._id,
        total: c.total,
      })),
    },
    resources: {
      byStatus: resourceStats.map((r) => ({ status: r._id, count: r.count })),
    },
    workforce: {
      attendanceLast7Days: attendanceStats.map((a) => ({
        status: a._id,
        count: a.count,
      })),
    },
    procurement: {
      byStatus: procurementStats.map((p) => ({
        status: p._id,
        count: p.count,
        totalAmount: p.totalAmount,
      })),
    },
  });
});

module.exports = { getPMDashboard };
