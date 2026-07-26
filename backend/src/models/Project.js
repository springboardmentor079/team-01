const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Residential",
        "Commercial",
        "Industrial",
        "Infrastructure",
        "Government",
      ],
      required: [true, "Project category is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Project start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Project end date is required"],
      validate: {
        validator: function (value) {
          if (!this.startDate || !value) {
            return true;
          }

          return value >= this.startDate;
        },
        message: "endDate must be greater than or equal to startDate",
      },
    },
    budget: {
      type: Number,
      required: [true, "Project budget is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["planning", "in-progress", "on-hold", "completed", "closed"],
      default: "planning",
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ status: 1 });
projectSchema.index({ createdBy: 1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
