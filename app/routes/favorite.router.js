module.exports = app => {
  const favorite = require('../controllers/favorite.controller')
  const router = require('express').Router()

  router.post('/add', favorite.addToFavorite)
  router.delete('/remove/:id', favorite.deleteFavorite)
  router.get('/get/:id', favorite.getFavorite)
  router.get('/:userId/get', favorite.findAll)

  app.use('/api/favorite', router)
}