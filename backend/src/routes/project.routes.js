const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createProjectValidator,
  updateProjectValidator,
} = require("../validators/project.validator");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject,
} = require("../controllers/project.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager"),
  createProjectValidator,
  validate,
  createProject,
);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put(
  "/:id",
  allow("admin", "project_manager"),
  updateProjectValidator,
  validate,
  updateProject,
);
router.delete("/:id", allow("admin"), deleteProject);
router.patch("/:id/close", allow("admin", "project_manager"), closeProject);

module.exports = router;
