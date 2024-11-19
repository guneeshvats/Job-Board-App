const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Additional fields
  employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Temporary', 'Freelance'], required: true },
  experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior', 'Executive'], required: true },
  industry: { type: String }, // e.g., IT, Finance, Healthcare
  skillsRequired: [String], // Array of required skills for the job
  educationLevel: { type: String, enum: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'] }, // Minimum education requirement
  benefits: [String], // Array of benefits, e.g., ["Health Insurance", "Retirement Plan"]
  applicationDeadline: { type: Date }, // Optional application deadline
  isRemote: { type: Boolean, default: false }, // Whether the job is remote
  
  // Meta fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update 'updatedAt' before each save
jobSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
