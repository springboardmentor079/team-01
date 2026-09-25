const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
} = require("../controllers/expense.Controller");

const {
  createExpenseValidator,
  updateExpenseValidator,
  idValidator,
  projectIdValidator,
} = require("../validators/expenseValidator");

const { validate } = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.use(protect);

router.post(
  "/",
  allowRoles("admin", "project_manager"),
  createExpenseValidator,
  validate,
  createExpense,
);

router.get("/", getExpenses);
router.get(
  "/project/:projectId/summary",
  projectIdValidator,
  validate,
  getBudgetSummary,
);
router.get("/:id", idValidator, validate, getExpenseById);

router.put(
  "/:id",
  allowRoles("admin", "project_manager"),
  updateExpenseValidator,
  validate,
  updateExpense,
);

router.delete(
  "/:id",
  allowRoles("admin"),
  idValidator,
  validate,
  deleteExpense,
);

module.exports = router;
