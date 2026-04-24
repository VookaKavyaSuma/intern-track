const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide the role/position'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
    questions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
