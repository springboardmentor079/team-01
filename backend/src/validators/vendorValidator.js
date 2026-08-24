const { body, param } = require("express-validator");

exports.createVendorValidator = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("category").optional().trim(),
  body("contactPerson").optional().trim(),
  body("phone").optional().trim(),
  body("email").optional().isEmail().withMessage("must be a valid email"),
  body("address").optional().trim(),
];

exports.updateVendorValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
  body("name").optional().trim().notEmpty(),
  body("category").optional().trim(),
  body("contactPerson").optional().trim(),
  body("phone").optional().trim(),
  body("email").optional().isEmail().withMessage("must be a valid email"),
  body("address").optional().trim(),
];

exports.idParamValidator = [
  param("id").isMongoId().withMessage("Valid id is required"),
];
