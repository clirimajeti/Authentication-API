const User = require('../models/User');
const Cake = require('../models/Cake');

module.exports = {
  setCake: async function (receiver_id, cake) {
    try {
      const user = await User.findOne({ _id: receiver_id })
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
          const newCake = await new Cake({
            cake_name: cake.cake_name,
            cake_cook: cake.cake_cook,
            date: cake.date,
          });
          user.cakes.push(newCake);
          await user.save();
          return {
            status: 200,
            message: "User has added a new Cake"
          };
      }
    } catch (error) {
      return {
        status: 500,
        message:"Problem occurred add the cake",
        error: error
      };
    }
  },
  deleteCake: async function (user_id, cake_id) {
    try {
      const user = await User.findOne({ _id: user_id });
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
        // find the cake from the array
        const userCake = ((user.cakes).filter(cake => cake.id == cake_id))[0];
        if(userCake){
          // Cake is removed from cakes array
          user.cakes.pull(userCake);
  
          // new user data saved
          await user.save();
          
          return {
            status: 200,
            message: "Cake has been removed"
          };
        } else {
          return {
            status: 406,
            message: "Cake should exist"
          };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: "Problem occurred to remove cake",
        error: error
      };
    }
  },
  getCakes: async function (sort = -1) {
    // Sorting properties that can be user
    // sort by ascending order: 'asc', 'ascending', 1 ;
    // sort by descending order: 'desc', 'descending', -1;
    try {
      const cakes = await User.find({}).sort({ cakes: sort});
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
        cakes: formatedCakesArray,
        sort: 'Descending',
      }; 
    } catch (error) {
      return {
        status: 500,
        message: "Unable to get the users",
        error: error
      }
    }
  },
  getCakeByID: async function (userId, id) {
    const user =  await User.findOne({_id: userId});
    if(user){
      const cake = ((user.cakes).filter(cake => cake.id == id))[0];
       let formatedCake = {
        _id: cake._id,
        cake_name: cake.cake_name,
        cake_cook: cake.cake_cook,
        date: cake.date,
        rating: cake.rating
       }
       console.log(cake)
       return {
         status: 200,
         cake: formatedCake
       }; 
    } else {
      return {
        status: 404,
        message: "Cake not found"
      }
    }
        
   }
}