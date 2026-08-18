const { body } = require("express-validator");

const progressCategories = [
  "Foundation",
  "Structural",
  "Electrical",
  "Plumbing",
  "Finishing",
  "Inspection",
];

const createSiteProgressValidator = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(progressCategories)
    .withMessage("Invalid category"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("delay.delayed")
    .optional()
    .isBoolean()
    .withMessage("delay.delayed must be a boolean"),
  body("delay.reason")
    .optional({ nullable: true })
    .isString()
    .withMessage("delay.reason must be a string"),
  body("delay.revisedDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("delay.revisedDate must be a valid ISO8601 date"),
];

const updateSiteProgressValidator = [
  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId")
    .bail(),
  body("category")
    .optional()
    .isIn(progressCategories)
    .withMessage("Invalid category"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("delay.delayed")
    .optional()
    .isBoolean()
    .withMessage("delay.delayed must be a boolean"),
  body("delay.reason")
    .optional({ nullable: true })
    .isString()
    .withMessage("delay.reason must be a string"),
  body("delay.revisedDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("delay.revisedDate must be a valid ISO8601 date"),
];

module.exports = {
  createSiteProgressValidator,
  updateSiteProgressValidator,
};
