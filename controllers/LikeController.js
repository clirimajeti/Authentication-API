// Service
const LikeService = require('../services/LikeService');

module.exports = {
  likeCake: async function (req, res) {
    if(req.userId && req.body.cake_id){
      const response  = await LikeService.setLike(req.userId, req.body.cake_id);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  unlikeCake: async function (req, res) {
    if(req.userId && req.body.user_id && req.body.cake_id){
      const response  = await LikeService.deletelike(req.userId, req.body.cake_id, req.body.user_id);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  mostLikes: async function (req, res) {
    const response  = await LikeService.getCakes();
    res.status(response.status).json(response);
  }
};
