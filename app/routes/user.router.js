module.exports = app => {
  const user = require('../controllers/user.controller')
  const router = require('express').Router();
  const upload = require("../upload")

  router.post('/register', user.register)
  router.post('/login', user.login)
  router.post('/loginAdmin', user.loginAdmin)
  router.get('/get/:id', user.getById)
  router.get('/get', user.getAllUser)
  router.delete('/delete/:id', user.delete)
  router.post('/update/:id', user.updateUser)
  router.post('/update-foto/:id', upload.single('foto'), user.updateFotoProfil)

  app.use('/api/user', router)
}