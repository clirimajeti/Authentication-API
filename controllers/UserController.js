const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


module.exports = {
  async createUser (req, res) {
    try {
      const { user_name, email, password } = req.body;
      let errors = [];
      // Check required fields
      if (!user_name || !email || !password) {
        errors.push({ message: "Please fill in all fields" });
      }
      // Check password length
      if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters"});
      }
    
      if (errors.length > 0) {
        res.json(errors);
      } else {
        // Validation passed
        let user = await User.findOne({ user_name: user_name });
        if(user){
          res.status(406).json({message: 'Username exits! Please try another username!'})
        } else {
          const newUser = await new User({
            user_name,
            email,
            password
          });
          
          // Hash Password
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newUser.password, salt);  
          // Set hashed password
          newUser.password = hash;
          // Save User
          await newUser.save()

          res.status(201).json({
            message: "User is created"
          });
        }
      } 
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  },
  async login (req, res) {
    try {
      // Match User
      let user = await User.findOne({user_name: req.body.user_name})
    
      if (!user) {
        res.json({message: 'That user is not registered'});
      } 
      // Match password
      bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          // Assign a token to user
          await jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET || '12345', (err, token) => {
              res.status(200).json({
                token
              }); 
            });
        } else {
          res.status(403).json({message: 'Username or password are incorrect'});
        }
      });
    } catch (error) {
      res.status(403).json({
        message: "Problem occurred trying to login",
        error: error
      });
    }
  }
}
