const { body, param } = require("express-validator");

const createExpenseValidator = [
  body("projectId").isMongoId().withMessage("Valid projectId is required"),
  body("category")
    .isIn([
      "labor",
      "material",
      "equipment",
      "transportation",
      "maintenance",
      "administrative",
    ])
    .withMessage("Invalid category"),
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a non-negative number"),
  body("date").optional().isISO8601().toDate(),
  body("description").optional().trim(),
];

const updateExpenseValidator = [
  param("id").isMongoId().withMessage("Invalid expense id"),
  body("category")
    .optional()
    .isIn([
      "labor",
      "material",
      "equipment",
      "transportation",
      "maintenance",
      "administrative",
    ])
    .withMessage("Invalid category"),
  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a non-negative number"),
  body("date").optional().isISO8601().toDate(),
  body("description").optional().trim(),
];

const idValidator = [param("id").isMongoId().withMessage("Invalid expense id")];

const projectIdValidator = [
  param("projectId").isMongoId().withMessage("Invalid project id"),
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator,
  idValidator,
  projectIdValidator,
};
