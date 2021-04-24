const jwt = require('jsonwebtoken');
const pool = require('../config/queries')

module.exports = {
  setLike: async function (token, cakeId) {
    try {
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345').user; 
      // const user = await User.findOne({ _id: giver_id })
      if(!loggedInUser) {
        return {
          status: 403,
          message: 'You do not have premission to like the cake!'
        };
      } else {
        let like = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND cake_id = $2', [loggedInUser.user.id, cakeId])
        if(like){
          return {
            status: 200,
            message: "Cake is liked already!"
          };
        } else {
          let cake = await pool.query('SELECT * FROM cakes WHERE id = $1', [cakeId])
          if(cake){
            const res = await pool.query('INSERT INTO likes (user_id, cake_id) VALUES ($1, $2, $3, $4, $5)',[loggedInUser.user.id, cakeId])
            return {
              status: 200,
              message: "Cake has been liked"
            };
          } else {
            return {
              status: 404,
              message: "Cake does not exists"
            };
          }
        }
      }
    } catch (error) {
      return {
        status: 500,
        message:"Problem occurred to like the cake",
        error: error
      };
    }
  },
  deletelike: async function (token, cakeId) {
    try { 
      let loggedInUser = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET || '12345').user; 
  
      if(!loggedInUser) {
        return {
          status: 403,
          message: 'You do not have premission to unlike the cake!'
        };
      } else {
        
        let cake = await pool.query('SELECT * FROM cakes WHERE id = $1', [cakeId])
        if(cake){
          let like = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND cake_id = $2', [loggedInUser.user.id, cakeId])
      
          if(like){
            let res = await pool.query('DELETE FROM likes WHERE user_id = $1 AND cake_id = $2', [loggedInUser.user.id, cakeId])
            if(res){
              return {
                status: 200,
                message: "Cake has been unliked"
              };
            }
          } else {
            return {
              status: 200,
              message: "Cake should be liked first!"
            };
          }
   
        } else {
          return {
            status: 404,
            message: "Cake not found"
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
}