const { body } = require("express-validator");

const resourceCategories = [
  "Excavators",
  "Concrete Mixers",
  "Cranes",
  "Dump Trucks",
  "Generators",
  "Safety Equipment",
];

const createResourceValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(resourceCategories)
    .withMessage("Invalid category"),
];

const updateResourceValidator = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string"),
  body("category")
    .optional()
    .isIn(resourceCategories)
    .withMessage("Invalid category"),
];

const allocateResourceValidator = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId"),
];

module.exports = {
  createResourceValidator,
  updateResourceValidator,
  allocateResourceValidator,
};
