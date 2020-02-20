const mongoose = require('mongoose');

const LikeSchema =  new mongoose.Schema({
  user_id: { 
    type:String,
    required: true
  }
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;