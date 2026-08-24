const SiteProgress = require("../models/SiteProgress");
const Resource = require("../models/Resource");
const Worker = require("../models/Worker");
const Attendance = require("../models/Attendance");
const Procurement = require("../models/Procurement");

exports.getProgressReport = async (projectId) => {
  const filter = projectId ? { projectId } : {};
  const entries = await SiteProgress.find(filter);

  const byCategory = {};
  let delayedCount = 0;

  entries.forEach((entry) => {
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
    if (entry.delay?.delayed) delayedCount += 1;
  });

  const delaySummary = entries
    .filter((entry) => entry.delay?.delayed)
    .map((entry) => ({
      category: entry.category,
      reason: entry.delay.reason,
      revisedDate: entry.delay.revisedDate,
    }));

  return {
    totalEntries: entries.length,
    byCategory,
    delayedCount,
    onTimeCount: entries.length - delayedCount,
    delaySummary,
  };
};

exports.getResourceReport = async (projectId) => {
  const filter = projectId ? { projectId } : {};
  const resources = await Resource.find(filter);

  const byStatus = { available: 0, allocated: 0, maintenance: 0 };
  const byCategory = {};

  resources.forEach((resource) => {
    byStatus[resource.status] = (byStatus[resource.status] || 0) + 1;
    byCategory[resource.category] = (byCategory[resource.category] || 0) + 1;
  });

  const total = resources.length;
  const utilizationRate =
    total > 0 ? ((byStatus.allocated / total) * 100).toFixed(1) + "%" : "0%";

  return {
    totalResources: total,
    byStatus,
    byCategory,
    utilizationRate,
  };
};

exports.getWorkforceReport = async (projectId) => {
  const workerFilter = {};
  const workers = await Worker.find(workerFilter);

  const byCategory = {};
  workers.forEach((worker) => {
    byCategory[worker.category] = (byCategory[worker.category] || 0) + 1;
  });

  const attendanceFilter = projectId ? { projectId } : {};
  const attendanceRecords = await Attendance.find(attendanceFilter);

  const attendanceSummary = { present: 0, absent: 0, "half-day": 0 };
  attendanceRecords.forEach((record) => {
    if (attendanceSummary[record.status] !== undefined) {
      attendanceSummary[record.status] += 1;
    }
  });

  const totalMarked = attendanceRecords.length;
  const attendanceRate =
    totalMarked > 0
      ? (
          ((attendanceSummary.present + attendanceSummary["half-day"] * 0.5) /
            totalMarked) *
          100
        ).toFixed(1) + "%"
      : "0%";

  return {
    totalWorkers: workers.length,
    byCategory,
    attendanceSummary,
    attendanceRate,
  };
};

exports.getProcurementReport = async (projectId) => {
  const filter = projectId ? { projectId } : {};
  const requests = await Procurement.find(filter).populate("vendorId", "name");

  const byStatus = {
    requested: 0,
    approved: 0,
    ordered: 0,
    delivered: 0,
    cancelled: 0,
  };
  let totalSpend = 0;
  const vendorSpend = {};

  requests.forEach((req) => {
    byStatus[req.status] = (byStatus[req.status] || 0) + 1;

    if (req.status === "delivered") {
      const spend =
        (req.deliveredQuantity || req.quantity) * (req.unitPrice || 0);
      totalSpend += spend;

      const vendorName = req.vendorId?.name || "Unknown Vendor";
      vendorSpend[vendorName] = (vendorSpend[vendorName] || 0) + spend;
    }
  });

  const topVendors = Object.entries(vendorSpend)
    .map(([vendorName, spend]) => ({ vendorName, totalSpend: spend }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  return {
    totalRequests: requests.length,
    byStatus,
    totalSpend,
    topVendors,
  };
};
