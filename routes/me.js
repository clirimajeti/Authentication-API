const express = require('express');
const router = express.Router();

// Bcrypt
const bcrypt = require('bcryptjs');

// Jwt Auth
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../config/auth');

// User model
const User = require('../models/User');

// Controller
const ProfileController = require('../controllers/ProfileController');

// Get user data 
router.get('', 
  isAuthenticated,
  ProfileController.getProfile
);

// Like a user
router.put('/update-password', 
  isAuthenticated, 
  ProfileController.setNewPassword
);

module.exports = router;