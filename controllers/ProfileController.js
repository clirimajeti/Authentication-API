
// Services
const PasswordService = require('../services/PasswordService');
const UserService = require('../services/UserService');


module.exports = {
  async getLoggedInUser(req, res) {
    if(req.token){
      const response  = await UserService.getUserByToken(req.token);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  async setNewPassword (req, res) {
    const {old_password, new_password} = req.body;
    if(req.token || old_password || new_password){
      const response  = await UserService.setNewPassword(old_password, new_password, req.token);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  async getUser (req, res) {
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
