const User = require('../models/User');
const Like = require('../models/Like');
const Cake = require('../models/Cake');
const jwt = require('jsonwebtoken');

module.exports = {
  setLike: async function (token, cakeId, giver_id) {
    try {
      const bearer = token.split(" ");
      // get the token from array
      const bearerToken = bearer[1];

      // Extract the user ID from the token
      let data = jwt.decode(bearerToken, process.env.ACCESS_TOKEN_SECRET || '12345'); 
  
      const user = await User.findOne({ _id: giver_id })
      if(!user){
        return {
          status: 404,
          message: 'User not exits!'
        };
      }
      const cakeIndex = user.cakes.findIndex((cake) => cake._id == cakeId)

      if(cakeIndex > -1){
          const found = (user.cakes[cakeIndex].likes).some(like => like.user_id === giver_id);
          if (!found) {
            const like = await new Like({
              user_id: data._id
            });
            user.cakes[cakeIndex].rating += 1;
            user.cakes[cakeIndex].likes.push(like);
            await user.save();
            return {
              status: 200,
              message: "Cake has been liked"
            };
          }
     
        } else {
          return {
            status: 200,
            message: "Cake is liked already!"
          };
        }
    } catch (error) {
      return {
        status: 500,
        message:"Problem occurred to like the cake",
        error: error
      };
    }
  },
  deletelike: async function (cakeId, giver_id) {
    try {
      const cake = await Cake.findOne({ _id: cakeId });
      if(!cake){
        return {
          status: 404,
          message: 'Cake not exits!'
        };
      } else {
        // find the user like from the array
        const cakeLikes = ((cake.likes).filter(like => like.user_id == giver_id))[0];
        if(cakeLikes){
          // Like is removed from likes array
          cale.likes.pull(cakeLikes);
  
          // likes counter updated
          if(cake.rating > 0){
            cake.rating -= 1;
          }
          // new user data saved
          await cake.save();
          
          return {
            status: 200,
            message: "Cake has been unliked"
          };
        } else {
          return {
            status: 406,
            message: "Cake should first be liked"
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
  getCakes: async function (sort = -1) {
    // Sorting properties that can be user
    // sort by ascending order: 'asc', 'ascending', 1 ;
    // sort by descending order: 'desc', 'descending', -1;
    try {
      const cakes = await Cake.find({}).sort({ rating: sort});
      let formatedCakesArray = cakes.map(cake => {
        return {
          _id: cake._id,
          cake_name: cake.cake_name,
          cake_cook: cake.cake_cook,
          date: cake.date,
          rating: cake.rating
        };
      });
      return {
        status: 200,
        users: formatedCakesArray,
        sort: 'Descending',
      }; 
    } catch (error) {
      return {
        status: 500,
        message: "Unable to get the cakes",
        error: error
      }
    }
  }
}