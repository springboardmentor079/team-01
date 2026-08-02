const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Engineers",
        "Supervisors",
        "Contractors",
        "Skilled Workers",
        "Unskilled Workers",
        "Consultants",
      ],
      required: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dailyWage: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

workerSchema.index({ category: 1 });

module.exports = mongoose.model("Worker", workerSchema);
