const { param, body } = require("express-validator");

const idValidator = [param("id").isMongoId().withMessage("Invalid user id")];

const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),
  body("role")
    .optional()
    .isIn([
      "admin",
      "project_manager",
      "site_engineer",
      "contractor",
      "worker",
      "client",
    ])
    .withMessage("Invalid role"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];

module.exports = { idValidator, updateUserValidator };
