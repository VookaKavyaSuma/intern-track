const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { tailorResume } = require('../controllers/resumeController');

// Protect all resume routes
router.use(protect);

// POST /api/resume/tailor
router.post('/tailor', tailorResume);

module.exports = router;
