const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  analyzeJob,
} = require('../controllers/jobController');

// All routes below are protected
router.use(protect);

// POST /api/jobs/analyze — must be before /:id routes
router.post('/analyze', analyzeJob);

// GET  /api/jobs      — list all jobs
// POST /api/jobs      — create a job
router.route('/').get(getJobs).post(createJob);

// PUT    /api/jobs/:id — update a job
// DELETE /api/jobs/:id — delete a job
router.route('/:id').put(updateJob).delete(deleteJob);

module.exports = router;
