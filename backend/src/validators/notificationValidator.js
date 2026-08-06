const { param } = require("express-validator");

exports.idParamValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
];
