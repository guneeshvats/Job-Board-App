const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true }, // Google ID for OAuth users
  role: { type: String, enum: ['job_seeker', 'recruiter'], required: true },
  
  // Additional fields for user profile
  profilePicture: { type: String }, // URL or path to profile picture
  phone: { type: String, unique: true, sparse: true }, // Optional unique phone number
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  company: { type: String }, // Only relevant for recruiters
  bio: { type: String, maxlength: 500 }, // Short bio or description
  
  // Job seeker-specific fields
  experience: [
    {
      jobTitle: { type: String },
      company: { type: String },
      location: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String }
    }
  ],
  education: [
    {
      school: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  ],
  skills: [String], // Array of skills
  resume: { type: String }, // URL or path to resume file

  // Recruiter-specific fields
  companyWebsite: { type: String }, // Only for recruiter accounts
  position: { type: String }, // Position of the recruiter within the company

  // Meta fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update 'updatedAt' before each save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
