const express = require('express');
const router = express.Router();

// Controllers
const UserController = require('../controllers/UserController');
const LikeController = require('../controllers/LikeController');

const User = require('../models/User');

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

// Most likes
router.get('/most-liked',
  LikeController.mostLikes
);

router.delete('/users', (req, res, next)=>{
  User.deleteMany({ email: /test@test.com/}).then(() =>{
    res.json({
      message: "deleted"
    })
  })
})


module.exports = router;