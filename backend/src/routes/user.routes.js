const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
} = require("../controllers/user.Controller");
const {
  idValidator,
  updateUserValidator,
} = require("../validators/userValidator");
const { validate } = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(protect, allowRoles("admin"));

router.get("/", getAllUsers);
router.get("/:id", idValidator, validate, getUserById);
router.put("/:id", updateUserValidator, validate, updateUser);

module.exports = router;
