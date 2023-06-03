module.exports = app => {
  const user = require('../controllers/user.controller')
  const router = require('express').Router();

  router.post('/register', user.register)
  router.post('/login', user.login)
  router.get('/get/:id', user.getById)

  app.use('/api/user', router)
}