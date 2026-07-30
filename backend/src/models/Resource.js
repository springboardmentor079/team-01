const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Excavators",
        "Concrete Mixers",
        "Cranes",
        "Dump Trucks",
        "Generators",
        "Safety Equipment",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "allocated", "maintenance"],
      default: "available",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    assignedDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

resourceSchema.index({ status: 1 });
resourceSchema.index({ projectId: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
