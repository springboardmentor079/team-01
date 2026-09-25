const express = require("express");
const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validators/auth.validator");
const {
  register,
  login,
  forgotPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
