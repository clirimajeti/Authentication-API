// Service
const AuthService = require('../services/AuthService')

module.exports = {
  createUser: async function (req, res) {
    const { user_name, email, password } = req.body; 
    if(user_name && email && password){
      const response  = await AuthService.createNewUser(user_name, email, password);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  login: async function (req, res) {
    const { user_name, password } = req.body; 
    if(user_name && password){
      const response  = await AuthService.userLogin(user_name, password);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  }
}
