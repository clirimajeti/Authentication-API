const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('545833916372-2j0a4tnhv0f6283fg2v9prn496fhgenj.apps.googleusercontent.com');

module.exports = {
  // Format of token
  // Authorization: Bearer <access_token>

  // Verify Token
  isAuthenticated: async function  (req, res, next) {
    try {
      const bearerHeader = req.headers['authorization'];
      //Check if token is undefined
      if( typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(" ");
        // get the token from array
        const token = bearer[1];
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '545833916372-2j0a4tnhv0f6283fg2v9prn496fhgenj.apps.googleusercontent.com',
        });
        if(ticket) {
          const payload = ticket.getPayload();
          const userid = payload['sub'];
          req.userId = userid;
          req.token = token;
          // Next middleware
          return next();
         } else {
          res.status(403).json({
            message: "User is not logged in!"
          });
          res.redirect('/login');
         }  
      } else {
        res.status(403).json({
          message: "User is not logged in!"
        });
        res.redirect('/login');
      }
    } catch (error) {
     console.log(error)
    }
  }
}