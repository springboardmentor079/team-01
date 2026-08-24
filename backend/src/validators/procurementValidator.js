const { body, param } = require("express-validator");

exports.createProcurementValidator = [
  body("projectId").isMongoId().withMessage("Valid projectId is required"),
  body("vendorId").isMongoId().withMessage("Valid vendorId is required"),
  body("inventoryId").isMongoId().withMessage("Valid inventoryId is required"),
  body("itemName").trim().notEmpty().withMessage("itemName is required"),
  body("quantity").isFloat({ gt: 0 }).withMessage("quantity must be > 0"),
  body("unitPrice").optional().isFloat({ min: 0 }),
  body("notes").optional().trim(),
];

exports.idParamValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
];

exports.deliverValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("deliveredQuantity")
    .isFloat({ gt: 0 })
    .withMessage("deliveredQuantity must be > 0"),
  body("notes").optional().trim(),
];

exports.cancelValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("notes").optional().trim(),
];
