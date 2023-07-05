const express = require('express');
const router = express.Router();
const { createJobType, allJobsType, updateJobType, deleteJobType } = require('../controllers/jobsTypeController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//job type routes /api/jobtype/...

router.post('/create', isAuthenticated, isAdmin, createJobType);

router.get('/alljobtype', allJobsType);

router.put(
  '/update/:type_id',
  isAuthenticated,
  isAdmin,
  updateJobType
);

router.delete(
  '/delete/:type_id',
  isAuthenticated,
  isAdmin,
  deleteJobType
);

module.exports = router;