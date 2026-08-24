const Milestone = require('../models/Milestone');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/apiResponse');

const createMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.create(req.body);

  return sendResponse(
    res,
    201,
    true,
    'Milestone created successfully',
    milestone
  );
});

const getMilestonesByProject = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ projectId: req.params.projectId }).sort({
    targetDate: 1,
  });

  return sendResponse(
    res,
    200,
    true,
    'Milestones fetched successfully',
    milestones
  );
});

const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!milestone) {
    return sendResponse(res, 404, false, 'Milestone not found');
  }

  return sendResponse(
    res,
    200,
    true,
    'Milestone updated successfully',
    milestone
  );
});

const deleteMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findByIdAndDelete(req.params.id);

  if (!milestone) {
    return sendResponse(res, 404, false, 'Milestone not found');
  }

  return sendResponse(res, 200, true, 'Milestone deleted successfully');
});

module.exports = {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  deleteMilestone,
};
