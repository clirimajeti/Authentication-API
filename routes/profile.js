const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../config/auth');

// Controller
const ProfileController = require('../controllers/ProfileController');

// Get user data 
router.get('', 
  isAuthenticated,
  ProfileController.getLoggedInUser
);

// Update password of loggedInUser
router.put('/update-password', 
  isAuthenticated, 
  ProfileController.setNewPassword
);

module.exports = router;