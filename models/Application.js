const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, maxlength: 2000 }, // Optional max length for cover letter
  resume: { type: String }, // URL or path to resume file
  status: {
    type: String,
    enum: ['Applied', 'Accepted', 'Rejected', 'Hold'],
    default: 'Applied'
  },
  applicationDate: { type: Date, default: Date.now }, // Date when the application was submitted
  statusHistory: [
    {
      status: { type: String, enum: ['Applied', 'Accepted', 'Rejected', 'Hold'] },
      date: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // ID of user (e.g., recruiter) who updated status
    }
  ],
  recruiterNotes: { type: String, maxlength: 1000 }, // Optional notes from recruiter
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update 'updatedAt' and log status changes before each save
applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.updatedBy || this.userId // Optionally track the user making the update
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
