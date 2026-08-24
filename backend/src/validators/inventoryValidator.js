const { body, param } = require("express-validator");

exports.createInventoryValidator = [
  body("projectId").isMongoId().withMessage("Valid projectId is required"),
  body("itemName").trim().notEmpty().withMessage("itemName is required"),
  body("category").optional().trim(),
  body("unit").trim().notEmpty().withMessage("unit is required"),
  body("currentStock")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("currentStock must be >= 0"),
  body("minThreshold")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minThreshold must be >= 0"),
  body("unitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("unitPrice must be >= 0"),
];

exports.updateInventoryValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("itemName").optional().trim().notEmpty(),
  body("category").optional().trim(),
  body("unit").optional().trim().notEmpty(),
  body("minThreshold").optional().isFloat({ min: 0 }),
  body("unitPrice").optional().isFloat({ min: 0 }),
];

exports.stockChangeValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("quantity")
    .isFloat({ gt: 0 })
    .withMessage("quantity must be a positive number"),
  body("reason").optional().trim(),
];

exports.adjustStockValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("quantity")
    .isFloat()
    .withMessage("quantity is required and must be a number"),
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("reason is required for adjustments"),
];

exports.idParamValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
];
