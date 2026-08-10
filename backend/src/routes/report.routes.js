const express = require("express");
const router = express.Router();
const {
  getProgressReport,
  getResourceReport,
  getWorkforceReport,
  getProcurementReport,
} = require("../controllers/report.Controller");
const { exportReport } = require("../controllers/reportExport.Controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/progress", protect, getProgressReport);
router.get("/resource", protect, getResourceReport);
router.get("/workforce", protect, getWorkforceReport);
router.get("/procurement", protect, getProcurementReport);

router.get("/:type/export", protect, exportReport);

module.exports = router;
