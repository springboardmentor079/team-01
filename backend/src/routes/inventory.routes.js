const express = require("express");
const router = express.Router();
const {
  createInventory,
  getInventoryByProject,
  getInventoryById,
  updateInventory,
  deleteInventory,
  restockItem,
  consumeItem,
  adjustStock,
  getInventoryLogs,
} = require("../controllers/inventory.Controller");
const {
  createInventoryValidator,
  updateInventoryValidator,
  stockChangeValidator,
  adjustStockValidator,
  idParamValidator,
} = require("../validators/inventoryValidator");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.post("/", protect, createInventoryValidator, createInventory);
router.get("/project/:projectId", protect, getInventoryByProject);
router.get("/:id", protect, idParamValidator, getInventoryById);
router.put("/:id", protect, updateInventoryValidator, updateInventory);
router.delete(
  "/:id",
  protect,
  allowRoles("Admin"),
  idParamValidator,
  deleteInventory,
);

router.post("/:id/restock", protect, stockChangeValidator, restockItem);
router.post("/:id/consume", protect, stockChangeValidator, consumeItem);
router.post("/:id/adjust", protect, adjustStockValidator, adjustStock);
router.get("/:id/logs", protect, idParamValidator, getInventoryLogs);

module.exports = router;
