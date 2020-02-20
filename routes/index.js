const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');

// User model
const User = require('../models/User');

// Controllers
const UserController = require('../controllers/UserController');
const LikeController = require('../controllers/LikeController');

// Wellcome route
router.get('/', (req, res) => {
  res.json({
    message: "Home"
  })
});

// Signup handle
router.post('/signup',
  UserController.createUser 
);

// Login handle
router.post('/login',
  UserController.login   
);

// Log out handle
router.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
   res.json({
     message: "User is logged out"
   });
});

// Most likes
router.get('/most-liked',
  LikeController.mostLikes
);


module.exports = router;