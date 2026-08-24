const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");

const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id,
  });

  return sendResponse(res, 201, true, "Project created successfully", project);
});

const getProjects = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const totalCount = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return sendResponse(res, 200, true, "Projects fetched successfully", {
    projects,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("team", "name email role")
    .populate("createdBy", "name email");

  if (!project) {
    return sendResponse(res, 404, false, "Project not found");
  }

  return sendResponse(res, 200, true, "Project fetched successfully", project);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return sendResponse(res, 404, false, "Project not found");
  }

  return sendResponse(res, 200, true, "Project updated successfully", project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return sendResponse(res, 404, false, "Project not found");
  }

  return sendResponse(res, 200, true, "Project deleted successfully");
});

const closeProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return sendResponse(res, 404, false, "Project not found");
  }

  if (project.status === "closed") {
    return sendResponse(res, 400, false, "Project is already closed");
  }

  // Future checks can be added here, such as requiring all milestones to be completed before closure.
  project.status = "closed";
  await project.save();

  return sendResponse(res, 200, true, "Project closed successfully", project);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject,
};
