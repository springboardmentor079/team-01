const mongoose = require("mongoose");

const siteProgressSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Foundation",
        "Structural",
        "Electrical",
        "Plumbing",
        "Finishing",
        "Inspection",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delay: {
      delayed: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        trim: true,
        default: "",
      },
      revisedDate: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

siteProgressSchema.index({ projectId: 1 });
siteProgressSchema.index({ date: -1 });

module.exports = mongoose.model("SiteProgress", siteProgressSchema);
