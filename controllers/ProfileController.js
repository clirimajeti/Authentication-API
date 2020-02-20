const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = {
  async getProfile (req, res) {
    try {
      let data = await jwt.decode(req.token, '12345');
      res.status(200).json({
        _id: data.user._id,
        user_name: data.user.user_name,
        email: data.user.email, 
        like_count: data.user.like_count,
        likes: data.user.likes
      });
    } catch (error) {
      res.status(500).json({
        message: "Problem occurred to get profile data",
        error: error
      });
    }
  },
  async setNewPassword (req, res) {
    try {
      const {old_password, new_password} = req.body;
      const data = jwt.decode(req.token, process.env.ACCESS_TOKEN_SECRET || '12345');
      const user = await User.findOne({ user_name: data.user.user_name });
      if(new_password.length < 6){
        res.status(406).json({
          message: "New Password length is not correct"
        });
      }
      if(!user){
        res.status(404).json({
          message: "User is not found"
        });
      } else {
        const isMatch = await bcrypt.compare(old_password, user.password);
        if(isMatch){
          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(new_password, salt,(err, hash) => {
              if (err) throw err;
              // Set hashed password
              user.password = hash;
              // Save new password
              user.save()
              res.status(200).json({
                message: "Password has changed"
              }); 
            })
          }); 
        } else {
        res.status(403).json({message: 'Old Password is incorrect'});
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Problem occurred to set new password",
        error: error
      });
    }
  },
  async getUser (req, res) {
    await User.findOne({_id: req.params.id}, await function (err, user) {
      let formatedUser = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        likes: user.likes,
        like_count: user.like_count
      }
      res.json(formatedUser);  
    });
  }
}
