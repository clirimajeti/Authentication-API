// Service
const CakeService = require('../services/CakeService');

module.exports = {
  createCake: async function (req, res) {
    if(req.params.id && req.body){
      const response  = await CakeService.setCake(req.params.id, req.body);
      res.status(response.status).json(response);
    } else {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  },
  deleteCake: async function (req, res) {
    if(req.params.id && req.userId){
      const response  = await CakeService.deleteCake(req.params.id, req.cakeId);
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
    console.log(req.params.id, 'id')
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
