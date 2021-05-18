// Service
const AuthService = require('../services/AuthService')

module.exports = {
  createUser: async function (req, res) {
    const { auth_token } = req.body; 
    if(auth_token){
      const response  = await AuthService.createNewUser(user_name, email, password);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  login: async function (req, res) {
    const { user } = req.body; 

    if(user){
      const response  = await AuthService.userLogin(user);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  }
}
