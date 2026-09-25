const express = require("express");
const router = express.Router();
const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendor.Controller");
const {
  createVendorValidator,
  updateVendorValidator,
  idParamValidator,
} = require("../validators/vendorValidator");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.post("/", protect, createVendorValidator, createVendor);
router.get("/", protect, getAllVendors);
router.get("/:id", protect, idParamValidator, getVendorById);
router.put("/:id", protect, updateVendorValidator, updateVendor);
router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  idParamValidator,
  deleteVendor,
);

module.exports = router;
