const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "labor",
        "material",
        "equipment",
        "transportation",
        "maintenance",
        "administrative",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

expenseSchema.index({ projectId: 1, category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
