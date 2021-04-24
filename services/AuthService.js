const jwt = require('jsonwebtoken');
const pool = require('../config/queries')

// Services
const PasswordService = require('./PasswordService');

// Models
// const User = require('../models/User');

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
        let response = await pool.query('SELECT * FROM users WHERE user_name = $1', [user_name])
    
        let user = response.rows.length ? response.rows : null
        // let user = await User.findOne({ user_name: user_name });
        if(user){
            return {
              status: 406,
              message: 'Username exits! Please try another username!'
            }
        } else {
          // Hash Password
          let hash = await PasswordService.hashPassword(password);
          console.log({user_name, email, hash})
          const res = await pool.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)', [user_name, email, hash])
          console.log(res, 'res')
          if (res) {
            return {
              status: 201,
              message: "User is created"
            };
          } 
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
      let response = await pool.query('SELECT * FROM users WHERE user_name = $1', [user_name])
    
      let user = response.rows.length ? response.rows[0] : null
      // let user = await User.findOne({user_name: user_name})
    
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