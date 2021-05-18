const express = require('express');
const router = express.Router();

// Checks if user is Authenticated
const { isAuthenticated } = require('../config/auth');

// Controller for the Like & Unlike feature
const LikeController = require('../controllers/LikeController');
const CakeController = require('../controllers/CakeController');

// Unlike a cake
router.post('',
  isAuthenticated, 
  CakeController.createCake
);

// Get cake data 
router.get('/',
    isAuthenticated, 
    CakeController.getCakes
  );

// Get cake data 
router.get('/:id/:cakeId', 
    isAuthenticated, 
    CakeController.getCake
  );

// Like a cake
router.post('/like', 
  isAuthenticated, 
  LikeController.likeCake
);

// Unlike a cake
router.post('/unlike',
  isAuthenticated, 
  LikeController.unlikeCake
);

module.exports = router;