const db = require('../model')
const User = db.users;
const Op = db.Sequelize.Op
const { success } = require('../base/response.base')

exports.register = (req, res) => {
  if (!req.body.nama && !req.body.password) {
    res.status(400).json(success('Nama & Password tidak boleh kosong', '', 400))
    return;
  }
  const register = {
    nama: req.body.nama,
    password: req.body.password,
    nomor: req.body.nomor
  }
  User.create(register)
    .then(data => {
      res.status(200).json(success('Success', data, '200'))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat ', '', 500))
    })
}

exports.login = (req, res) => {
  if (!req.body.nama && !req.body.password) {
    res.status(400).json(success('Username & Password salah', '', 400))
    return;
  }
  User.findOne({ where: { nama: req.body.nama, password: req.body.password }})
    .then(data => {
      res.status(200).json(success('Success', data, '200'))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat ', '', 500))
    })
}

exports.getById = (req, res) => {
  const id = req.params.id

  User.findByPk(id)
    .then(data => {
      res.status(200).json(success('Success', data, '200'))
    }).catch(err => {
      res.status(500).json(success(err.message || 'Terjadi error saat ', '', 500))
    })
}

// exports.update = (req, res) => {

// }

// exports.delete = (req, res) => {

// }

// exports.deleteAll = (req, res) => {

// }