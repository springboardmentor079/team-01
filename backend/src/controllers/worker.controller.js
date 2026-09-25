const Worker = require("../models/Worker");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");

const createWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.create(req.body);
  return sendResponse(res, 201, true, "Worker registered successfully", worker);
});

const getWorkers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const workers = await Worker.find(filter).sort({ createdAt: -1 });
  return sendResponse(res, 200, true, "Workers fetched successfully", workers);
});

const updateWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!worker) {
    return sendResponse(res, 404, false, "Worker not found");
  }

  return sendResponse(res, 200, true, "Worker updated successfully", worker);
});

const deleteWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndDelete(req.params.id);

  if (!worker) {
    return sendResponse(res, 404, false, "Worker not found");
  }

  return sendResponse(res, 200, true, "Worker deleted successfully");
});

module.exports = {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
};
