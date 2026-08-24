const { body } = require("express-validator");

const workerCategories = [
  "Engineers",
  "Supervisors",
  "Contractors",
  "Skilled Workers",
  "Unskilled Workers",
  "Consultants",
];

const createWorkerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(workerCategories)
    .withMessage("Invalid category"),
  body("contact").optional().isString().withMessage("Contact must be a string"),
  body("dailyWage")
    .notEmpty()
    .withMessage("Daily wage is required")
    .isFloat({ min: 0 })
    .withMessage("Daily wage must be a number greater than or equal to 0"),
];

const updateWorkerValidator = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string"),
  body("category")
    .optional()
    .isIn(workerCategories)
    .withMessage("Invalid category"),
  body("contact").optional().isString().withMessage("Contact must be a string"),
  body("dailyWage")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Daily wage must be a number greater than or equal to 0"),
];

module.exports = {
  createWorkerValidator,
  updateWorkerValidator,
};
