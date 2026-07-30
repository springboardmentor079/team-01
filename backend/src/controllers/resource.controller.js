const Resource = require("../models/Resource");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");

const createResource = asyncHandler(async (req, res) => {
  const resource = await Resource.create(req.body);
  return sendResponse(
    res,
    201,
    true,
    "Resource created successfully",
    resource,
  );
});

const getResources = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.projectId) filter.projectId = req.query.projectId;

  const resources = await Resource.find(filter)
    .populate("projectId", "name")
    .sort({ createdAt: -1 });

  return sendResponse(
    res,
    200,
    true,
    "Resources fetched successfully",
    resources,
  );
});

const updateResource = asyncHandler(async (req, res) => {
  const allowedUpdates = {};
  if (req.body.name !== undefined) allowedUpdates.name = req.body.name;
  if (req.body.category !== undefined)
    allowedUpdates.category = req.body.category;

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!resource) {
    return sendResponse(res, 404, false, "Resource not found");
  }

  return sendResponse(
    res,
    200,
    true,
    "Resource updated successfully",
    resource,
  );
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);

  if (!resource) {
    return sendResponse(res, 404, false, "Resource not found");
  }

  return sendResponse(res, 200, true, "Resource deleted successfully");
});

const allocateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return sendResponse(res, 404, false, "Resource not found");
  }

  if (resource.status === "allocated") {
    return sendResponse(res, 400, false, "Resource is already allocated");
  }

  resource.status = "allocated";
  resource.projectId = req.body.projectId;
  resource.assignedDate = new Date();
  await resource.save();

  return sendResponse(
    res,
    200,
    true,
    "Resource allocated successfully",
    resource,
  );
});

const unassignResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return sendResponse(res, 404, false, "Resource not found");
  }

  if (resource.status !== "allocated") {
    return sendResponse(res, 400, false, "Resource is not currently allocated");
  }

  resource.status = "available";
  resource.projectId = null;
  resource.assignedDate = null;
  await resource.save();

  return sendResponse(
    res,
    200,
    true,
    "Resource unassigned successfully",
    resource,
  );
});

const setMaintenanceStatus = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return sendResponse(res, 404, false, "Resource not found");
  }

  resource.status = "maintenance";
  resource.projectId = null;
  resource.assignedDate = null;
  await resource.save();

  return sendResponse(
    res,
    200,
    true,
    "Resource marked for maintenance",
    resource,
  );
});

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  allocateResource,
  unassignResource,
  setMaintenanceStatus,
};
