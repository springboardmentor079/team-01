const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'delayed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.index({ projectId: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
