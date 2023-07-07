const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

//auth routes /api/auth/...
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/profile', isAuthenticated, userProfile);

module.exports = router;