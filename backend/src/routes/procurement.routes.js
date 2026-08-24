const express = require("express");
const router = express.Router();
const {
  createProcurement,
  getAllProcurements,
  getProcurementById,
  approveProcurement,
  orderProcurement,
  deliverProcurement,
  cancelProcurement,
} = require("../controllers/procurement.Controller");
const {
  createProcurementValidator,
  idParamValidator,
  deliverValidator,
  cancelValidator,
} = require("../validators/procurementValidator");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.post("/", protect, createProcurementValidator, createProcurement);
router.get("/", protect, getAllProcurements);
router.get("/:id", protect, idParamValidator, getProcurementById);

router.patch(
  "/:id/approve",
  protect,
  allowRoles("admin", "project_manager"),
  idParamValidator,
  approveProcurement,
);
router.patch(
  "/:id/order",
  protect,
  allowRoles("admin", "project_manager"),
  idParamValidator,
  orderProcurement,
);
router.patch("/:id/deliver", protect, deliverValidator, deliverProcurement);
router.patch("/:id/cancel", protect, cancelValidator, cancelProcurement);

module.exports = router;
