const mongoose = require('mongoose');
const like = require('../models/Like');
const user = require('../models/User');

const CakeSchema =  new mongoose.Schema({
  user_id: {
    type: [user._id]
  },
  cake_name: { 
    type:String,
    required: true
  },
  cake_cook: { 
    type:String,
    required: true
  },
  date: { 
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    default: ''
  },
  likes: {
    type: [ like.user_id ],
  },
  rating: {
    type: Number,
    default: 0
  }

});

const Cake = mongoose.model('Cake', CakeSchema);

module.exports = Cake;