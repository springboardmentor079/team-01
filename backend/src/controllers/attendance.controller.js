const Attendance = require("../models/Attendance");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");

const markAttendance = asyncHandler(async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
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
  const record = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate("workerId", "name category");

  if (!record) {
    return sendResponse(res, 404, false, "Attendance record not found");
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
