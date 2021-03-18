const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../config/auth');

const ProfileController = require('../controllers/ProfileController');
const CakeController = require('../controllers/CakeController')


// Get user data 
router.get('/:id', 
  ProfileController.getUser
  );
// Unlike a cake
router.post('/:id/cake',
  isAuthenticated, 
  CakeController.createCake
);

module.exports = router;