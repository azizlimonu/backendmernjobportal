const express = require('express');
const router = express.Router();
const { allUsers, singleUser, editUser, deleteUser, createUserJobsHistory } = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//user routes /api/user/...
router.get('/allusers', isAuthenticated, isAdmin, allUsers);
router.post('/jobhistory', isAuthenticated, createUserJobsHistory);
router.put('/edit/:id', isAuthenticated, editUser);
router.delete(
  '/admin/user/delete/:id',
  isAuthenticated,
  isAdmin,
  deleteUser
);
router.get('/:id', isAuthenticated, singleUser);

module.exports = router;