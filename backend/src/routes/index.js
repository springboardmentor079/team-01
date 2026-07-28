const { Router } = require("express");
const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const milestoneRoutes = require("./milestone.routes");
const siteProgressRoutes = require("./siteProgress.routes");
const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/milestones", milestoneRoutes);
router.use("/site-progress", siteProgressRoutes);

module.exports = router;
