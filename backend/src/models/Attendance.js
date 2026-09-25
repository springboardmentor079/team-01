const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day"],
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ workerId: 1, date: -1 });
attendanceSchema.index({ projectId: 1, date: -1 });
attendanceSchema.index(
  { workerId: 1, projectId: 1, date: 1 },
  { unique: true },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
