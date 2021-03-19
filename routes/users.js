const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../config/auth');

const ProfileController = require('../controllers/ProfileController');


// Get user data 
router.get('/:id', 
  ProfileController.getUser
  );

module.exports = router;