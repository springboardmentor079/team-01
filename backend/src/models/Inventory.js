const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    minThreshold: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unitPrice: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Inventory", inventorySchema);
