const Attendance = require("../models/Attendance");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const Project = require("../models/Project");
const notificationService = require("../services/notification.service");

const markAttendance = asyncHandler(async (req, res) => {
  try {
    const created = await Attendance.create(req.body);
    const record = await created.populate("workerId", "name category");

    if (record.status === "absent") {
      const project = await Project.findById(record.projectId);
      if (project?.createdBy) {
        await notificationService.createNotification({
          userId: project.createdBy,
          type: "attendance_flag",
          message: `${record.workerId?.name || "A worker"} was marked absent on ${new Date(record.date).toLocaleDateString()}.`,
          entityType: "Attendance",
          entityId: record._id,
        });
      }
    }

    return sendResponse(
      res,
      201,
      true,
      "Attendance marked successfully",
      record,
    );
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(
        res,
        409,
        false,
        "Attendance already marked for this worker on this project and date",
      );
    }
    throw error;
  }
});

const getAttendanceByProject = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ projectId: req.params.projectId })
    .populate("workerId", "name category")
    .sort({ date: -1 });

  return sendResponse(
    res,
    200,
    true,
    "Attendance records fetched successfully",
    records,
  );
});

const getAttendanceByWorker = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ workerId: req.params.workerId })
    .populate("projectId", "name")
    .sort({ date: -1 });

  return sendResponse(
    res,
    200,
    true,
    "Attendance records fetched successfully",
    records,
  );
});

const updateAttendance = asyncHandler(async (req, res) => {
  const existingRecord = await Attendance.findById(req.params.id);
  if (!existingRecord) {
    return sendResponse(res, 404, false, "Attendance record not found");
  }

  const wasAbsent = existingRecord.status === "absent";

  const record = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate("workerId", "name category");

  // Only notify if this update is newly marking the worker absent
  // (not if it was already absent, and not for other status changes)
  if (req.body.status === "absent" && !wasAbsent) {
    const project = await Project.findById(record.projectId);
    if (project?.createdBy) {
      await notificationService.createNotification({
        userId: project.createdBy,
        type: "attendance_flag",
        message: `${record.workerId?.name || "A worker"} was marked absent on ${new Date(record.date).toLocaleDateString()}.`,
        entityType: "Attendance",
        entityId: record._id,
      });
    }
  }

  return sendResponse(
    res,
    200,
    true,
    "Attendance updated successfully",
    record,
  );
});

module.exports = {
  markAttendance,
  getAttendanceByProject,
  getAttendanceByWorker,
  updateAttendance,
};
