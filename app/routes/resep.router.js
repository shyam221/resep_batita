module.exports = app => {
  const resep = require('../controllers/resep.controller')
  const router = require('express').Router()
  const upload = require("../upload")

  router.post('/create', upload.single('file'), resep.createResep)
  router.post('/update/:id', upload.single('file'), resep.updateResep)
  router.get('/get', resep.getAllResep)
  router.get('/get/:id', resep.getResep)
  router.get('/get/favorited/:userId', resep.getResepFavorited)
  router.delete('/delete/:id', resep.delete)
  router.get('/rekomendasi/get', resep.getRekomendasiResep)

  app.use('/api/resep', router)
}