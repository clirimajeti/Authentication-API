const User = require('../models/User');
const Like = require('../models/Like');
const jwt = require('jsonwebtoken');

module.exports = {
  setLike: async function (token, cakeId, giver_id) {
    try {
    
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345').user; 
      const user = await User.findOne({ _id: giver_id })

      if(!user){
        return {
          status: 404,
          message: 'User not exits!'
        };
      }
      const cakeIndex = user.cakes.findIndex((cake) => cake._id == cakeId)

        if(cakeIndex > -1){
          const found = (user.cakes[cakeIndex].likes).find(like => like.user_id === loggedInUser._id);

          if (!found) {
            const like = await new Like({
              user_id: loggedInUser._id,
              cake_id: cakeId
            });
            user.cakes[cakeIndex].rating += 1;
            user.cakes[cakeIndex].likes.push(like);
            user.markModified('cakes')
            await user.save();
            return {
              status: 200,
              message: "Cake has been liked"
            };
          } else {
            return {
              status: 200,
              message: "Cake is liked already!"
            };
          }
        } else {
          return {
            status: 404,
            message: "Cake not found!"
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
  deletelike: async function (token, cakeId, giver_id) {
    try { 
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345').user; 
  
      const user = await User.findOne({ _id: giver_id })
      if(!user){
        return {
          status: 404,
          message: 'User not exits!'
        };
      }
      const cakeIndex = user.cakes.findIndex((cake) => cake._id == cakeId)

        if (cakeIndex > -1) {

          const likes = (user.cakes[cakeIndex].likes).filter((like) => {
            return like.user_id !== loggedInUser._id
          });

          if (likes.length < (user.cakes[cakeIndex].likes).length) {

            user.cakes[cakeIndex].likes = likes

            // likes counter updated
            if(user.cakes[cakeIndex].rating > 0){
              user.cakes[cakeIndex].rating -= 1;
            }

            user.markModified('cakes')

            await user.save();
            
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
        } else {
          return {
            status: 404,
            message: "Cake not found!"
          };
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
      const users = await User.find({}).sort({ rating: sort});
      let allCakes = []
      users.map(user => {
       return allCakes = [...allCakes, ...user.cakes]
      });
      
      return {
        status: 200,
        cakes: allCakes,
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