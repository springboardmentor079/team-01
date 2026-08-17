const express = require("express");
const router = express.Router();

const { param } = require("express-validator");
const { validate } = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");
const {
  getPMDashboard,
  getAdminDashboard,
} = require("../controllers/dashboard.controller");

router.use(protect);

router.get(
  "/pm/:projectId",
  allowRoles("admin", "project_manager"),
  [param("projectId").isMongoId().withMessage("Invalid project id")],
  validate,
  getPMDashboard,
);

router.get("/admin", allowRoles("admin"), getAdminDashboard);

module.exports = router;
