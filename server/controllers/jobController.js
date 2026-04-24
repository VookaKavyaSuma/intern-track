const Job = require('../models/Job');
const aiService = require('../services/aiService');

// @desc    Get all jobs for the logged-in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('getJobs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new job entry
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { company, role, status, jobDescription, keywords, questions } =
      req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ message: 'Company and role are required' });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status: status || 'Applied',
      jobDescription: jobDescription || '',
      keywords: keywords || [],
      questions: questions || [],
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('createJob error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a job entry
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns this job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (error) {
    console.error('updateJob error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a job entry
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns this job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error('deleteJob error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Analyze a job description (mock — uses aiService stub)
// @route   POST /api/jobs/analyze
// @access  Private
const analyzeJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide a job description' });
    }

    // Delegate to the AI service (currently returns mock data)
    const analysis = await aiService.analyze(jobDescription);

    res.json(analysis);
  } catch (error) {
    console.error('analyzeJob error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob, analyzeJob };
