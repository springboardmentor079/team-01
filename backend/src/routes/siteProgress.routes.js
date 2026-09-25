const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createSiteProgressValidator,
  updateSiteProgressValidator,
} = require("../validators/siteProgress.validator");
const {
  createSiteProgress,
  getSiteProgressByProject,
  updateSiteProgress,
  deleteSiteProgress,
} = require("../controllers/siteProgress.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager", "site_engineer"),
  createSiteProgressValidator,
  validate,
  createSiteProgress,
);
router.get("/project/:projectId", getSiteProgressByProject);
router.put(
  "/:id",
  allow("admin", "project_manager", "site_engineer"),
  updateSiteProgressValidator,
  validate,
  updateSiteProgress,
);
router.delete("/:id", allow("admin", "project_manager"), deleteSiteProgress);

module.exports = router;
