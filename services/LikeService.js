const User = require('../models/User');
const Like = require('../models/Like');

module.exports = {
  setLike: async function (receiver_id, giver_id) {
    try {
      const user = await User.findOne({ _id: receiver_id })
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
        // Check if user has liked before that user
        const found = (user.likes).some(like => like.user_id === giver_id);
        if(!found){
          const like = await new Like({
            user_id: giver_id
          });
          user.like_count += 1;
          user.likes.push(like);
          await user.save();
          return {
            status: 200,
            message: "User has been liked"
          };
        } else {
          return {
            status: 200,
            message: "User is liked already!"
          };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message:"Problem occurred to like the user",
        error: error
      };
    }
  },
  deletelike: async function (receiver_id, giver_id) {
    try {
      const user = await User.findOne({ _id: receiver_id });
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
        // find the user like from the array
        const userLike = ((user.likes).filter(like => like.user_id == giver_id))[0];
        if(userLike){
          // Like is removed from likes array
          user.likes.pull(userLike);
  
          // likes counter updated
          if(user.like_count > 0){
            user.like_count -= 1;
          }
          // new user data saved
          await user.save();
          
          return {
            status: 200,
            message: "User has been unliked"
          };
        } else {
          return {
            status: 406,
            message: "User should first be liked"
          };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: "Problem occurred to remove like",
        error: error
      };
    }
  },
  getLikes: async function (sort = -1) {
    // Sorting properties that can be user
    // sort by ascending order: 'asc', 'ascending', 1 ;
    // sort by descending order: 'desc', 'descending', -1;
    try {
      const users = await User.find({}).sort({ like_count: sort});
      let formatedUsersArray = users.map(user => {
        return {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
          likes: user.likes,
          like_count: user.like_count
        };
      });
      return {
        status: 200,
        users: formatedUsersArray,
        sort: 'Descending',
      }; 
    } catch (error) {
      return {
        status: 500,
        message: "Unable to get the users",
        error: error
      }
    }
  }
}