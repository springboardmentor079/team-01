const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  markAttendanceValidator,
} = require("../validators/attendance.validator");
const {
  markAttendance,
  getAttendanceByProject,
  getAttendanceByWorker,
  updateAttendance,
} = require("../controllers/attendance.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager", "contractor", "site_engineer"),
  markAttendanceValidator,
  validate,
  markAttendance,
);
router.get("/project/:projectId", getAttendanceByProject);
router.get("/worker/:workerId", getAttendanceByWorker);
router.put(
  "/:id",
  allow("admin", "project_manager", "contractor", "site_engineer"),
  updateAttendance,
);

module.exports = router;
