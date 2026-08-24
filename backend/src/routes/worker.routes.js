const { Router } = require("express");
const { protect: authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles: allow } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createWorkerValidator,
  updateWorkerValidator,
} = require("../validators/worker.validator");
const {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
} = require("../controllers/worker.controller");

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  allow("admin", "project_manager", "contractor"),
  createWorkerValidator,
  validate,
  createWorker,
);
router.get("/", getWorkers);
router.put(
  "/:id",
  allow("admin", "project_manager", "contractor"),
  updateWorkerValidator,
  validate,
  updateWorker,
);
router.delete("/:id", allow("admin"), deleteWorker);

module.exports = router;
