const express = require('express');
const router = express.Router();

// Checks if user is Authenticated
const { isAuthenticated } = require('../config/auth');

// Controller for the Like & Unlike feature
const LikeController = require('../controllers/LikeController');
const ProfileController = require('../controllers/ProfileController');


// Get user data 
router.get('/:id', 
  ProfileController.getUser
  );

// Like a user
router.post('/:id/like', 
  isAuthenticated, 
  LikeController.likeUser
);

// Unlike a user
router.post('/:id/unlike',
  isAuthenticated, 
  LikeController.unlikeUser
);

module.exports = router;