module.exports = app => {
  const spoonacular = require('../controllers/third_party/spoonacular.controller')
  const router = require('express').Router()

  router.get('/get', spoonacular.findAllRecipe)
  router.get('/get/:idResep', spoonacular.detailResep)

  app.use('/api/resep', router)
}