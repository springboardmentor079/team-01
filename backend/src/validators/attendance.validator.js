const { body } = require("express-validator");

const attendanceStatuses = ["present", "absent", "half-day"];

const markAttendanceValidator = [
  body("workerId")
    .notEmpty()
    .withMessage("Worker ID is required")
    .isMongoId()
    .withMessage("Worker ID must be a valid ObjectId"),
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Project ID must be a valid ObjectId"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(attendanceStatuses)
    .withMessage("Invalid status"),
];

module.exports = {
  markAttendanceValidator,
};
