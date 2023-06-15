const db = require("../model");
const Admin = db.admin;
const Op = db.Sequelize.Op;
const {
  success,
  getPagination,
  paginationData,
} = require("../base/response.base");

exports.registerAdmin = (req, res) => {
  if (!req.body.nama && !req.body.password && !req.body.email) {
    res
      .status(400)
      .json(success("Nama & Password tidak boleh kosong", "", 400));
    return;
  }
  const register = {
    nama: req.body.nama,
    password: req.body.password,
    email: req.body.email,
  };
  const count = Admin.count({ where: { email: { [Op.eq]: req.body.email } } })
    .then(count => {
      if (count == 0) {
        return false
      } else {
        return true
      }
    });
  if (count) {
    res
        .status(400)
        .json(success("Email telah digunakan.", "", 400));
      return;
  }
  Admin.create(register)
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
  Admin.findOne({ where: { email: req.body.email, password: req.body.password }})
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
  Admin.findByPk(req.params.id)
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
}

exports.getAll = (req, res) => {
  const { search, page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);

  Admin.findAndCountAll({
    where: {
      [Op.or]: {
        'nama': {
          [Op.like]: "%" + search + "%",
        },
        'email': {
          [Op.like]: "%" + search + "%",
        },
      },
    },
    attributes: {
      exclude: ['password']
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
}

exports.delete = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json(success("Not found", null, 400));
    return;
  }

  Admin.destroy({ where: { id: id } })
    .then((_) => {
      res.status(200).json(success("Success", null, 200));
    })
    .catch((e) => {
      res.status(500).json(success(e.message, null, 500));
    });
}

exports.update = (req, res) => {
  const id = req.params.id;

  const update = {};
  if (req.body.nama && req.body.nama !== "") {
    update.nama = req.body.nama;
  }
  if (req.body.email && req.body.email !== "") {
    update.email = req.body.email;
  }
  if (req.body.password && req.body.password !== "") {
    update.password = req.body.password;
  }

  Admin.update(update, {
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