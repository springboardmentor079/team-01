const { body } = require("express-validator");

const milestoneStatuses = ["pending", "in-progress", "completed", "delayed"];

const createMilestoneValidator = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("targetDate")
    .notEmpty()
    .withMessage("Target date is required")
    .isISO8601()
    .withMessage("Target date must be a valid ISO8601 date"),
  body("status")
    .optional()
    .isIn(milestoneStatuses)
    .withMessage("Invalid status"),
];

const updateMilestoneValidator = [
  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId")
    .bail(),
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string"),
  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid ISO8601 date"),
  body("status")
    .optional()
    .isIn(milestoneStatuses)
    .withMessage("Invalid status"),
];

module.exports = {
  createMilestoneValidator,
  updateMilestoneValidator,
};
