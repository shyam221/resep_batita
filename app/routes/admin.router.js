module.exports = app => {
  const admin = require('../controllers/admin.controller')
  const router = require('express').Router();

  router.post('/register', admin.registerAdmin)
  router.post('/login', admin.loginAdmin)
  router.get('/get/:id', admin.getById)
  router.get('/get', admin.getAll)
  router.delete('/delete/:id', admin.delete)
  router.post('/update/:id', admin.update)

  app.use('/api/admin', router)
}