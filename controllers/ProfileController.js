// Services
const UserService = require('../services/UserService');

module.exports = {
  getLoggedInUser: async function (req, res) {
    if(req.token){
      const response  = await UserService.getUserByToken(req.token);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  setNewPassword: async function (req, res) {
    const {old_password, new_password} = req.body;
    if(req.token && old_password && new_password){
      const response  = await UserService.setNewPassword(old_password, new_password, req.token);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  getUser: async function (req, res) {
    if(req.params.id){
      const response  = await UserService.getUserByID(req.params.id);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  }
}
