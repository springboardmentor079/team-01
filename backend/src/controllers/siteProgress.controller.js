const SiteProgress = require("../models/SiteProgress");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");

const createSiteProgress = asyncHandler(async (req, res) => {
  const created = await SiteProgress.create({
    ...req.body,
    submittedBy: req.user.id,
  });

  const report = await created.populate("submittedBy", "name");

  return sendResponse(
    res,
    201,
    true,
    "Site progress report created successfully",
    report,
  );
});
const getSiteProgressByProject = asyncHandler(async (req, res) => {
  const reports = await SiteProgress.find({ projectId: req.params.projectId })
    .populate("submittedBy", "name email role")
    .sort({ date: -1 });

  return sendResponse(
    res,
    200,
    true,
    "Site progress reports fetched successfully",
    reports,
  );
});

const updateSiteProgress = asyncHandler(async (req, res) => {
  const report = await SiteProgress.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("submittedBy", "name");

  if (!report) {
    return sendResponse(res, 404, false, "Site progress report not found");
  }

  return sendResponse(
    res,
    200,
    true,
    "Site progress report updated successfully",
    report,
  );
});

const deleteSiteProgress = asyncHandler(async (req, res) => {
  const report = await SiteProgress.findByIdAndDelete(req.params.id);

  if (!report) {
    return sendResponse(res, 404, false, "Site progress report not found");
  }

  return sendResponse(
    res,
    200,
    true,
    "Site progress report deleted successfully",
  );
});

module.exports = {
  createSiteProgress,
  getSiteProgressByProject,
  updateSiteProgress,
  deleteSiteProgress,
};
