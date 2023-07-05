const express = require('express');
const router = express.Router();
const { createJob, singleJob, updateJob, showJobs } = require('../controllers/jobsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//jobs routes /api/job/...
router.post('/create', isAuthenticated, isAdmin, createJob);
router.get('/:id', singleJob);
router.put('/update/:job_id', isAuthenticated, isAdmin, updateJob);
router.get('/show', showJobs);

module.exports = router;