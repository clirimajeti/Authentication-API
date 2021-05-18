const mongoose = require('mongoose');
const cake = require('../models/Cake');

const UserSchema =  new mongoose.Schema({
  user_name: { 
    type:String,
    required: true
  },
  email: { 
    type:String,
    required: true
  },
  date: { 
    type: Date,
    default: Date.now
  },
  cakes: {
    type: [ cake.user_id ]
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;