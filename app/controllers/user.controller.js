const db = require("../model");
const User = db.users;
const Op = db.Sequelize.Op;
const { success,
  getPagination,
  paginationData,} = require("../base/response.base");

exports.register = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res
      .status(400)
      .json(success("Email & Password tidak boleh kosong", "", 400));
    return;
  }
  let roleUser
  if (req.body.role && req.body.role !== '') {
    roleUser = req.body.role
  } else {
    roleUser = 'USER'
  }
  const register = {
    nama: req.body.nama,
    password: req.body.password,
    nomor: req.body.nomor,
    email: req.body.email,
    role: roleUser
  };
  User.create(register)
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;

  const update = {};
  if (req.body.nama && req.body.nama !== "") {
    update.nama = req.body.nama;
  }
  if (req.body.nomor && req.body.nomor !== "") {
    update.nomor = req.body.nomor;
  }
  if (req.body.password && req.body.password !== "") {
    update.password = req.body.password;
  }
  if (req.body.email && req.body.email !== "") {
    update.email = req.body.email;
  }
  if (req.body.role && req.body.role !== "") {
    update.role = req.body.role;
  }

  User.update(update, {
    where: {
      id: id,
    },
  })
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.login = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(400).json(success("Username & Password salah", "", 400));
    return;
  }
  User.findOne({ where: { email: req.body.email, password: req.body.password } })
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.loginAdmin = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(400).json(success("Username & Password salah", "", 400));
    return;
  }
  User.findOne({ where: { email: req.body.email, password: req.body.password } })
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
}

exports.getById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.getAllUser = (req, res) => {
  console.log(req)
  const { search, page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);

  User.findAndCountAll({
    where: {
      [Op.or]: {
        'nama': {
          [Op.like]: "%" + search + "%",
        },
        'nomor': {
          [Op.like]: "%" + search + "%",
        },
        'email': {
          [Op.like]: '%' + search + '%'
        }
      },
    },
    limit,
    offset,
  })
    .then((data) => {
      const response = paginationData(data, page, limit)
      console.log(data)
      res
        .status(200)
        .json(success("Success", response, 200));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat fetch data", "", 500));
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json(success("Not found", null, 400));
    return;
  }

  User.destroy({ where: { id: id } })
    .then((_) => {
      res.status(200).json(success("Success", null, 200));
    })
    .catch((e) => {
      res.status(500).json(success(e.message, null, 500));
    });
};

// exports.deleteAll = (req, res) => {

// }
