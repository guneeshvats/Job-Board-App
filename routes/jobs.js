const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new job (Recruiter only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });

  const { title, description, location, salary, employmentType, experienceLevel } = req.body;
  try {
    const job = new Job({
      title,
      description,
      location,
      salary,
      employmentType,
      experienceLevel,
      postedBy: req.user.id
    });
    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ msg: 'Server error while creating job' });
  }
});

// Retrieve job listings with filters (for job seekers to find jobs)
router.get('/', async (req, res) => {
  const { location, salary, employmentType, experienceLevel } = req.query;
  const filters = {};
  if (location) filters.location = location;
  if (salary) filters.salary = { $gte: salary };
  if (employmentType) filters.employmentType = employmentType;
  if (experienceLevel) filters.experienceLevel = experienceLevel;

  try {
    const jobs = await Job.find(filters).populate('postedBy', 'name');
    res.json(jobs);
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    res.status(500).json({ msg: 'Server error while retrieving jobs' });
  }
});

// Retrieve jobs posted by the recruiter
router.get('/my-jobs', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });

  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (error) {
    console.error('Error retrieving recruiter jobs:', error);
    res.status(500).json({ msg: 'Server error while retrieving jobs' });
  }
});

// Retrieve applications for a specific job (Recruiter only)
router.get('/job-applications/:jobId', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });

  try {
    const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email');
    res.json(applications);
  } catch (error) {
    console.error('Error retrieving applications:', error);
    res.status(500).json({ msg: 'Server error while retrieving applications' });
  }
});

// Apply for a job (Job seeker only)
router.post('/:id/apply', auth, async (req, res) => {
  if (req.user.role !== 'job_seeker') return res.status(403).json({ msg: 'Access denied' });

  const { id } = req.params;
  const { coverLetter, resume } = req.body;

  try {
    const existingApplication = await Application.findOne({ jobId: id, userId: req.user.id });
    if (existingApplication) return res.status(400).json({ msg: 'You have already applied to this job' });

    const application = new Application({ jobId: id, userId: req.user.id, coverLetter, resume });
    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ msg: 'Server error while applying for job' });
  }
});

// Get all jobs the job seeker has applied for
router.get('/applied-jobs', auth, async (req, res) => {
  if (req.user.role !== 'job_seeker') return res.status(403).json({ msg: 'Access denied' });

  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('jobId', 'title location salary');
    res.json(applications);
  } catch (error) {
    console.error('Error retrieving applied jobs:', error);
    res.status(500).json({ msg: 'Server error while retrieving applied jobs' });
  }
});

// Update application status (Recruiter only)
router.patch('/job-applications/:applicationId/status', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });

  const { applicationId } = req.params;
  const { status } = req.body;
  const validStatuses = ['Applied', 'Accepted', 'Rejected', 'Hold'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    application.status = status;
    application.statusHistory.push({ status, updatedBy: req.user.id });
    await application.save();

    res.json({ msg: `Application status updated to ${status}`, application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ msg: 'Server error while updating application status' });
  }
});

module.exports = router;
