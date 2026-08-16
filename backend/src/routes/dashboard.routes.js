const express = require("express");
const router = express.Router();

const { getPMDashboard } = require("../controllers/dashboard.controller");
const { param } = require("express-validator");
const { validate } = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(protect);

router.get(
  "/pm/:projectId",
  allowRoles("admin", "project_manager"),
  [param("projectId").isMongoId().withMessage("Invalid project id")],
  validate,
  getPMDashboard,
);

module.exports = router;
