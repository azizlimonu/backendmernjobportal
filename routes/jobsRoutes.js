const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createJob, showJobs, singleJob, updateJob } = require('../controllers/jobsController');

//jobs routes /api/job/...
router.post('/create', isAuthenticated, isAdmin, createJob);
router.get('/show', showJobs);
router.get('/:id', singleJob);
router.put('/update/:job_id', isAuthenticated, isAdmin, updateJob);

module.exports = router;