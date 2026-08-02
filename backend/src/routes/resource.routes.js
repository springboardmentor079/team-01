const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createResourceValidator,
  updateResourceValidator,
  allocateResourceValidator,
} = require("../validators/resource.validator");
const {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  allocateResource,
  unassignResource,
  setMaintenanceStatus,
  markAvailable,
} = require("../controllers/resource.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager"),
  createResourceValidator,
  validate,
  createResource,
);
router.get("/", getResources);
router.put(
  "/:id",
  allow("admin", "project_manager"),
  updateResourceValidator,
  validate,
  updateResource,
);
router.delete("/:id", allow("admin"), deleteResource);
router.patch(
  "/:id/allocate",
  allow("admin", "project_manager"),
  allocateResourceValidator,
  validate,
  allocateResource,
);
router.patch(
  "/:id/unassign",
  allow("admin", "project_manager"),
  unassignResource,
);
router.patch(
  "/:id/maintenance",
  allow("admin", "project_manager"),
  setMaintenanceStatus,
);
router.patch(
  "/:id/mark-available",
  allow("admin", "project_manager"),
  markAvailable,
);

module.exports = router;
