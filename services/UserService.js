const jwt = require('jsonwebtoken');

// Services
const PasswordService = require('./PasswordService');

// Models
const User = require('../models/User');

module.exports = {
  getUserByToken: async function (token) {
    try {
      let data = await jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345');
      return {
        status: 200,
        user: {
          _id: data.user._id,
          user_name: data.user.user_name,
          email: data.user.email, 
          like_count: data.user.like_count,
          likes: data.user.likes
        }
      };
    } catch (error) {
      return {
        status: 500,
        message: "Problem occurred to get profile data",
        error: error
      };
    }
  },
  setNewPassword: async function (old_password, new_password, token) {
    try {

      const data = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345');
      const user = await User.findOne({ user_name: data.user.user_name });

      if(new_password.length < 6){
        return {
          status: 406,
          message: "New Password length is not correct"
        };
      }

      if(!user){
        return {
          status: 404,
          message: "User is not found"
        };
      } else {
        const isMatch = await PasswordService.comparePassword(old_password, user.password);
        if(isMatch){
          const hash = await PasswordService.hashPassword(new_password);
          // Set hashed password
          user.password = hash;
          // Save new password
          user.save();
          return {
            status: 200,
            message: "Password has changed"
          }; 

        } else {
            return {
              status: 403,
              message: 'Old Password is incorrect'
            }
        }
      }
    } catch (error) {
        return {
          status: 500,
          message: "Problem occurred to set new password",
          error: error
        }
    }
  },
  getUserByID: async function (id) {
   const user =  await User.findOne({_id: id});
   if(user){
      let formatedUser = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        likes: user.likes,
        like_count: user.like_count
      }
      return {
        status: 200,
        user: formatedUser
      }; 
   } else {
     return {
       status: 404,
       message: "User not found"
     }
   }
       
  }
}