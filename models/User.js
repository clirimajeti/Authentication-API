const mongoose = require('mongoose');
const like = require('../models/Like');

const UserSchema =  new mongoose.Schema({
  user_name: { 
    type:String,
    required: true
  },
  email: { 
    type:String,
    required: true
  },
  password: { 
    type:String,
    required: true
  },
  date: { 
    type: Date,
    default: Date.now
  },
  likes: {
    type: [ like.user_id ]
  },
  like_count: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;