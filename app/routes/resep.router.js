module.exports = app => {
  const resep = require('../controllers/resep.controller')
  const router = require('express').Router()
  const upload = require("../upload")

  router.post('/create', upload.single('file'), resep.createResep)
  router.post('/update/:id', upload.single('file'), resep.updateResep)
  router.get('/get', resep.getAllResep)
  router.get('/get/:id', resep.getResep)

  app.use('/api/resep', router)
}