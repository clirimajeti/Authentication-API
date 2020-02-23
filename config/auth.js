const jwt = require('jsonwebtoken');
module.exports = {
  // Format of token
  // Authorization: Bearer <access_token>

  // Verify Token
  isAuthenticated:function  (req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if token is undefined
    if( typeof bearerHeader !== 'undefined') {
      // split at the space
      const bearer = bearerHeader.split(" ");
      // get the token from array
      const bearerToken = bearer[1];

      // Extract the user ID from the token
      let data = jwt.decode(bearerToken, process.env.ACCESS_TOKEN_SECRET || '12345'); 
      
      // Set user id
      req.userId = data.user._id;

      // set the token
      req.token = bearerToken;
     
      // Next middleware
      return next();
    } else {
      res.status(403).json({
        message: "User is not logged in!"
      });
      res.redirect('/login');
    }
  }
}