const { body } = require("express-validator");

const projectCategories = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Government",
];

const projectStatuses = [
  "planning",
  "in-progress",
  "on-hold",
  "completed",
  "closed",
];

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(projectCategories)
    .withMessage("Invalid category"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("client").trim().notEmpty().withMessage("Client is required"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date")
    .custom((value, { req }) => {
      if (!req.body.startDate) {
        return true;
      }

      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return true;
      }

      if (endDate < startDate) {
        throw new Error("End date must be greater than or equal to start date");
      }

      return true;
    }),
  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be a number greater than or equal to 0"),
  body("team")
    .optional()
    .isArray()
    .withMessage("Team must be an array")
    .bail()
    .custom((team) =>
      team.every((memberId) => /^[a-fA-F0-9]{24}$/.test(memberId)),
    )
    .withMessage("Team must contain valid MongoDB ObjectIds"),
];

const updateProjectValidator = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string"),
  body("category")
    .optional()
    .isIn(projectCategories)
    .withMessage("Invalid category"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("client")
    .optional()
    .trim()
    .isString()
    .withMessage("Client must be a string"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date")
    .custom((value, { req }) => {
      if (!req.body.startDate) {
        return true;
      }

      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return true;
      }

      if (endDate < startDate) {
        throw new Error("End date must be greater than or equal to start date");
      }

      return true;
    }),
  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be a number greater than or equal to 0"),
  body("team")
    .optional()
    .isArray()
    .withMessage("Team must be an array")
    .bail()
    .custom((team) =>
      team.every((memberId) => /^[a-fA-F0-9]{24}$/.test(memberId)),
    )
    .withMessage("Team must contain valid MongoDB ObjectIds"),
  body("status").optional().isIn(projectStatuses).withMessage("Invalid status"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
};
