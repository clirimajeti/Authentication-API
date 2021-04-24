// Service
const CakeService = require('../services/CakeService');

module.exports = {
  createCake: async function (req, res) {
    if(req.token && req.body){
      const response  = await CakeService.createCake(req.token, req.body);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  deleteCake: async function (req, res) {
    if(req.token && req.cakeId){
      const response  = await CakeService.deleteCake(req.token, req.cakeId);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  getCakes: async function (req, res) {
    const response  = await CakeService.getCakes();
    res.status(response.status).json(response);
  },
  getCake: async function (req, res) {
    if(req.params.id){
      const response  = await CakeService.getCakeByID(req.params.id);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  }
};
