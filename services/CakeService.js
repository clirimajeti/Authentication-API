const pool = require('../config/queries')

const jwt = require('jsonwebtoken');

module.exports = {
  createCake: async function (token, cake) {
    try {
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345'); 
      let user = await pool.query('SELECT * FROM users WHERE id = $1', [loggedInUser.user.id])
      // const user = await User.findOne({ _id: loggedInUser.user._id })
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
        const res = await pool.query('INSERT INTO cakes (user_name, user_id, cake_name, served, url) VALUES ($1, $2, $3, $4, $5)', [user.user_name, user.id, cake.cake_name, cake.served, cake.url])
        if (res) {
          return {
            status: 200,
            message: "User has added a new Cake"
          };
        } 
      }
    } catch (error) {
      return {
        status: 500,
        message:"Problem occurred add the cake",
        error: error
      };
    }
  },
  deleteCake: async function (token, cake_id) {
    try {
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345');
      let user = await pool.query('SELECT * FROM users WHERE id = $1', [loggedInUser.user.id])
      // const user = await User.findOne({ _id: loggedInUser.user._id });
      if(!user){
        return {
          status: 404,
          message: 'Username not exits!'
        };
      } else {
        let cake = await pool.query('SELECT * FROM cakes WHERE cake_id = $1 AND user_id = $2', [cake_id, user.id])
        if(cake){
          let res = await pool.query('DELETE FROM cakes WHERE cake_id = $1 AND user_id = $2', [cake.id, user.id])
          if(res) {
            return {
              status: 200,
              message: "Cake has been removed"
            };
          } else {
            return {
              status: 500,
              message: "Something went wrong"
            };
          } 
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
  getCakes: async function (sort = 1) {
    // Sorting properties that can be user
    // sort by ascending order: 'asc', 'ascending', 1 ;
    // sort by descending order: 'desc', 'descending', -1;
    const sorted = sort == -1 ? 'DESC' : 'ASC'

    try {
      const response = await pool.query(`SELECT * FROM cakes ORDER BY id ${sorted}`)
      // const cakes = await User.find({}).sort({ cakes: sort});
      let formatedCakesArray = response.rows.map(cake => {
        return {
          id: cake.id,
          cake_name: cake.cake_name,
          cake_cook: cake.user_name,
          user_id: cake.user_id,
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
  getCakeByID: async function (cakeId) {
    let cake = await pool.query('SELECT * FROM cakes WHERE id = $1', [cakeId])
    // const user =  await User.findOne({_id: userId});
    if(cake){
       let formatedCake = {
        _id: cake.id,
        cake_name: cake.cake_name,
        cake_cook: cake.cake_cook,
        date: cake.date,
        rating: cake.rating
       }
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