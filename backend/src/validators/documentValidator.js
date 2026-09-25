const { body, param } = require("express-validator");

exports.createDocumentValidator = [
  body("projectId").isMongoId().withMessage("Valid projectId is required"),
  body("entityType").trim().notEmpty().withMessage("entityType is required"),
  body("entityId").isMongoId().withMessage("Valid entityId is required"),
];

exports.idParamValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
];
