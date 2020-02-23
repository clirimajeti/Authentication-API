// Service
const LikeService = require('../services/LikeService');

module.exports = {
  likeUser: async function (req, res) {
    if(req.params.id && req.userId){
      const response  = await LikeService.setLike(req.params.id, req.userId);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  unlikeUser: async function (req, res) {
    if(req.params.id && req.userId){
      const response  = await LikeService.deletelike(req.params.id, req.userId);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  mostLikes: async function (req, res) {
    const response  = await LikeService.getLikes();
    res.status(response.status).json(response);
  }
};
