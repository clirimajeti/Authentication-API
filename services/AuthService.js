const jwt = require('jsonwebtoken');

// Services
const PasswordService = require('./PasswordService');

// Models
const User = require('../models/User');

module.exports = {
  createNewUser: async function (user_name, email, password) {
    try {
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
        return {
          status: 403,
          errors
        }
      } else {
        // Validation passed
        let user = await User.findOne({ user_name: user_name });
        if(user){
            return {
              status: 406,
              message: 'Username exits! Please try another username!'
            }
        } else {
          const newUser = await new User({
            user_name,
            email,
            password
          });
          
          // Hash Password
          const hash = await PasswordService.hashPassword(newUser.password);
          // Set hashed password
          newUser.password = hash;
          // Save User
          await newUser.save()

          return {
            status: 201,
            message: "User is created"
          };
        }
      } 
    } catch (error) {
      return {
        status: 500,
        error
      };
    }
  },
  userLogin: async function (user_name, password) {
    try {
      // Match User
      let user = await User.findOne({user_name: user_name})
    
      if (!user) {
        res.json({message: 'That user is not registered'});
      } 
      // Match password
      const isMatch = await PasswordService.comparePassword(password, user.password);
      if(isMatch){
        // Assign a token to user
        const token  = await jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET || '12345');
        return {
          status: 200,
          token
        }
      } else {
        return {
          status: 403,
          message: 'Username or password are incorrect'
        }
      }
    } catch (error) {
      return {
        status: 403,
        message: "Problem occurred trying to login",
        error: error
      };
    }
  }
}