const { Router } = require("express");
const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const milestoneRoutes = require("./milestone.routes");
const siteProgressRoutes = require("./siteProgress.routes");
const resourceRoutes = require("./resource.routes");
const workerRoutes = require("./worker.routes");
const attendanceRoutes = require("./attendance.routes");
const inventoryRoutes = require("./inventory.routes");
const vendorRoutes = require("./vendor.routes");
const procurementRoutes = require("./procurement.routes");
const notificationRoutes = require("./notification.routes");
const reportRoutes = require("./report.routes");
const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/milestones", milestoneRoutes);
router.use("/site-progress", siteProgressRoutes);
router.use("/resources", resourceRoutes);
router.use("/workers", workerRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/vendors", vendorRoutes);
router.use("/procurement", procurementRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
