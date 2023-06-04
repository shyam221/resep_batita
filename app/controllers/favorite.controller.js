const db = require('../model')
const Favorite = db.favorites
const Op = db.Sequelize.Op
const { success, getPagination, paginationData } = require('../base/response.base')

exports.addToFavorite = (req, res) => {
  if (!req.body.idResep && !req.body.userId && !req.body.nama && !req.body.jumlahKkl) {
    res.status(400).json(success('Field required', '', 400))
    return;
  }
  const favorite = {
    idResep: req.body.idResep,
    nama: req.body.nama,
    jumlahKkl: req.body.jumlahKkl,
    userId: req.body.userId
  }
  Favorite.create(favorite)
    .then(data => {
      res.status(200).json(success('Success', data, 200))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat create favorite', '', 500))
    })
}

exports.deleteFavorite = (req, res) => {
  const id = req.params.id

  Favorite.findByPk(id)
    .then(data => {
      res.status(200).json(success('Success', data, '200'))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat ', '', 500))
    })
}

exports.findAll = (req, res) => {
  const userId = req.params.userId
  const { page, size } = req.query

  const { limit, offset } = getPagination(page - 1, size)

  Favorite.findAndCountAll({ where: { userId: userId }, limit, offset })
    .then(data => {
      const response = paginationData(data, page, limit)
      res.status(200).json(success('Success', response, '200'))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat fetch data', '', 500))
    })
}

exports.getFavorite = (req, res) => {
  const id = req.params.id

  Favorite.findByPk(id)
    .then(data => {
      res.status(200).json(success('Success', data, 200))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat fetch data', '', 500))
    })
}