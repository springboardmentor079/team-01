const Project = require("../models/Project");
const Milestone = require("../models/Milestone");
const SiteProgress = require("../models/SiteProgress");
const Resource = require("../models/Resource");
const Attendance = require("../models/Attendance");
const Procurement = require("../models/Procurement");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Worker = require("../models/Worker");
const Inventory = require("../models/Inventory");

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

// GET /api/dashboard/admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    userStats,
    recentUsers,
    projectStatusStats,
    projectCategoryStats,
    resourceCount,
    workerCount,
    procurementStats,
    totalSpend,
    lowStockCount,
    recentActivity,
  ] = await Promise.all([
    // Users by role
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),

    // 5 most recently registered users
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt"),

    // Projects by status
    Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    // Projects by category
    Project.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),

    // Total resources (system-wide)
    Resource.countDocuments(),

    // Total registered workers
    Worker.countDocuments(),

    // Procurement by status, system-wide
    Procurement.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),

    // Total spend across all projects
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),

    // Items below minThreshold, system-wide
    Inventory.countDocuments({
      $expr: { $lt: ["$currentStock", "$minThreshold"] },
    }),

    // Last 20 notifications as the activity feed
    Notification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("userId", "name role"),
  ]);

  const totalUsers = userStats.reduce((sum, r) => sum + r.count, 0);
  const totalProjects = projectStatusStats.reduce((sum, p) => sum + p.count, 0);

  return apiResponse(res, 200, true, "Admin dashboard data fetched", {
    users: {
      total: totalUsers,
      byRole: userStats.map((r) => ({ role: r._id, count: r.count })),
      recentlyRegistered: recentUsers,
    },
    projects: {
      total: totalProjects,
      byStatus: projectStatusStats.map((p) => ({
        status: p._id,
        count: p.count,
      })),
      byCategory: projectCategoryStats.map((c) => ({
        category: c._id,
        count: c.count,
      })),
    },
    systemAnalytics: {
      totalResources: resourceCount,
      totalWorkers: workerCount,
      totalSpendAllProjects: totalSpend[0]?.total || 0,
      lowStockItems: lowStockCount,
      procurement: procurementStats.map((p) => ({
        status: p._id,
        count: p.count,
        totalAmount: p.totalAmount,
      })),
    },
    activityLog: recentActivity.map((n) => ({
      id: n._id,
      type: n.type,
      message: n.message,
      user: n.userId ? { name: n.userId.name, role: n.userId.role } : null,
      isRead: n.isRead,
      createdAt: n.createdAt,
    })),
  });
});

module.exports = { getPMDashboard, getAdminDashboard };
