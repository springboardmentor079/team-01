const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.Controller");
const { idParamValidator } = require("../validators/notificationValidator");
const { protect } = require("../middlewares/auth.middleware");

router.get("/", protect, getMyNotifications);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id/read", protect, idParamValidator, markAsRead);
router.delete("/:id", protect, idParamValidator, deleteNotification);

module.exports = router;
