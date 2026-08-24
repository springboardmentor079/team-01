const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "task_assignment",
        "procurement_status",
        "attendance_flag",
        "deadline",
        "system",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      entityType: {
        type: String,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
