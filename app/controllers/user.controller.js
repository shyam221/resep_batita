const db = require("../model");
const fs = require("fs");
const moment = require('moment')
const { sendEmail, emailOtp } = require('./send_email.controller')
const User = db.users;
const Op = db.Sequelize.Op;
const { success,
  getPagination,
  paginationData,} = require("../base/response.base");

exports.register = (req, res) => {
  if (!req.body.nomor && !req.body.password) {
    res
      .status(400)
      .json(success("No Hp & Password tidak boleh kosong", "", 400));
    return;
  }
  let roleUser
  if (req.body.role && req.body.role !== '') {
    roleUser = req.body.role
  } else {
    roleUser = 'USER'
  }
  const otp = generateOTP()
  const register = {
    nama: req.body.nama,
    password: req.body.password,
    nomor: req.body.nomor,
    email: req.body.email,
    role: roleUser,
    beratBadan: req.body.beratBadan,
    otp: otp,
    isActive: roleUser === 'ADMIN' ? true : false,
    tanggalLahir: moment(req.body.tanggalLahir, 'DD/MM/YYYY').format('YYYY/MM/DD')
  };
  
  User.create(register)
    .then((data) => {
      const emailTemplate = emailOtp(data.nama, otp)
      sendEmail({ 
        from: 'noreply@kumpulanresepanak.com',
        to: data.email,
        subject: 'Verifikasi Akun',
        html: emailTemplate })
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.submitOtp = (req, res) => {
  const { otp, email } = req.query;
  
  const user = User.findOne({ where: { email: email, otp: otp } })
  if (user === null) {
    res
      .status(400)
      .json(success("OTP tidak sesuai", "", 400));
    return;
  } else {
    User.update({ isActive: true, otp: '' }, { where: { email: email, otp: otp } })
      .then((data) => {
        res.status(200).json(success("Success", data, "200"));
      })
  }
}

exports.resendOtp = async (req, res) => {
  const { nomor } = req.query;
  
  const user = await User.findOne({ where: { nomor: nomor } })
  if (user === null) {
    res
      .status(400)
      .json(success("User tidak ditemukan", "", 400));
    return;
  } else {
    const otp = generateOTP()
    console.log(user)
    await emailOtp(user.nama, otp, user.email)
    User.update({ isActive: false, otp: otp }, { where: { nomor: nomor } })
      .then((data) => {
        // sendEmail({ 
        //   from: 'noreply@kumpulanresepanak.com',
        //   to: email,
        //   subject: 'Verifikasi Akun',
        //   html: emailTemplate })
        res.status(200).json(success("Success", null, "200"));
      })
  }
}

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
  if (req.body.tanggalLahir && req.body.tanggalLahir !== "") {
    update.tanggalLahir = moment(req.body.tanggalLahir, 'DD/MM/YYYY').format('YYYY/MM/DD')
  }
  if (req.body.beratBadan && req.body.beratBadan !== '') {
    update.beratBadan = req.body.beratBadan
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
  if (!req.body.nomor && !req.body.password) {
    res.status(400).json(success("No Hp & Password salah", "", 400));
    return;
  }
  User.findOne({ where: { nomor: req.body.nomor, password: req.body.password } })
    .then((data) => {
      const tanggal = moment(data.tanggalLahir, 'YYYY/MM/DD').format('DD/MM/YYYY')
      data.tanggalLahir = moment(tanggal, 'DD/MM/YYYY')
      console.log(tanggal)
      
      if (data.fotoProfil) {
        let imgBase64 = Buffer.from(a.fotoProfil).toString('base64');
        data.fotoProfil = `data:image/jpeg;base64,${imgBase64}`
      }
      if (data.isActive)
        res.status(200).json(success("Success", data, "200"));
      else
        res.status(200).json(success("User belum aktif", null, 202));
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.loginAdmin = (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(400).json(success("Email & Password salah", "", 400));
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

exports.updateFotoProfil = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json(success("Not found", null, 400));
    return;
  }
  console.log(req.foto)
  const body = {
    namaFotoProfil: req.foto.originalname,
    fotoProfil: fs.readFileSync(
      __basedir + "/resources/static/assets/uploads/" + req.foto.filename
    )
  }

  User.update({ fotoProfil: body.fotoProfil, namaFotoProfil: body.namaFotoProfil }, {
    where: {
      id: id
    }
  })
  .then((data) => {
    console.log(data)
    fs.writeFileSync(
      __basedir + "/resources/static/assets/tmp/" + data.namaFotoProfil,
      data.image
    );
    res.status(200).json(success("Success", null, "200"));
  })
  .catch((err) => {
    console.log(err)
    res
      .status(500)
      .json(success("Terjadi error saat " + err.message, "", 500));
  });
}

// exports.deleteAll = (req, res) => {

// }
function generateOTP() {
  // Declare a digits variable 
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
