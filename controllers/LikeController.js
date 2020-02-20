const User = require('../models/User');
const Like = require('../models/Like');

module.exports = {
  async likeUser (req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
      if(!user){
        res.status(404).json({message: 'Username not exits!'});
      } else {
        // Check if user has liked before that user
        const found = (user.likes).some(like => like.user_id === req.userId);
        if(!found){
          const like = await new Like({
            user_id: req.userId
          });
          user.like_count += 1;
          user.likes.push(like);
          await user.save();
          res.status(200).json({
            message: "User has been liked"
          });
        } else {
          res.json({
            message: "User is liked already!"
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message:"Problem occurred to like the user",
        error: error
      });
    }
  },
  async unlikeUser (req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if(!user){
        res.status(404).json({message: 'Username not exits!'});
      } else {
        // find the user like from the array
        const userLike = ((user.likes).filter(like => like.user_id == req.userId))[0];
        if(userLike){
          // Like is removed from likes array
          user.likes.pull(userLike);
  
          // likes counter updated
          if(user.like_count > 0){
            user.like_count -= 1;
          }
          // new user data saved
          await user.save();
          
          res.status(200).json({
            message: "User has been unliked"
          });
        } else {
          res.status(406).json({
            message: "User should first be liked"
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Problem occurred to remove like",
        error: error
      });
    }
  },
  async mostLikes (req, res) {
    try {
      const users = await User.find({}).sort({ like_count: -1});
      let formatedUsersArray = users.map(user => {
        return {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
          likes: user.likes,
          like_count: user.like_count
        };
      });
      res.status(200).json(formatedUsersArray); 
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  }
}
