const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createMilestoneValidator,
  updateMilestoneValidator,
} = require("../validators/milestone.validator");
const {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestone.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager"),
  createMilestoneValidator,
  validate,
  createMilestone,
);
router.get("/project/:projectId", getMilestonesByProject);
router.put(
  "/:id",
  allow("admin", "project_manager"),
  updateMilestoneValidator,
  validate,
  updateMilestone,
);
router.delete("/:id", allow("admin"), deleteMilestone);

module.exports = router;
