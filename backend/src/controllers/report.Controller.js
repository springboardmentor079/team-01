const reportService = require("../services/report.service");

exports.getProgressReport = async (req, res, next) => {
  try {
    const report = await reportService.getProgressReport(req.query.projectId);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.getResourceReport = async (req, res, next) => {
  try {
    const report = await reportService.getResourceReport(req.query.projectId);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.getWorkforceReport = async (req, res, next) => {
  try {
    const report = await reportService.getWorkforceReport(req.query.projectId);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.getProcurementReport = async (req, res, next) => {
  try {
    const report = await reportService.getProcurementReport(
      req.query.projectId,
    );
    res.json(report);
  } catch (err) {
    next(err);
  }
};
