const db = require("../model");
const fs = require("fs");
const Resep = db.resep;
const Favorite = db.favorites;
const Op = db.Sequelize.Op;
const literal = db.Sequelize.literal

const {
  success,
  getPagination,
  paginationData,
} = require("../base/response.base");

exports.createResep = (req, res) => {
  const body = bodyReq(req);

  Resep.create(body)
    .then((data) => {
      fs.writeFileSync(
        __basedir + "/resources/static/assets/tmp/" + data.imageName,
        data.image
      );
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.updateResep = (req, res) => {
  const body = bodyReq(req);

  Resep.update(body, {
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      console.log(data)
      // fs.writeFileSync(
      //   __basedir + "/resources/static/assets/tmp/" + data.imageName,
      //   data.image
      // );
      res.status(200).json(success("Success", null, "200"));
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.getResep = (req, res) => {
  const resepId = req.params.id;

  Resep.findByPk(resepId)
    .then((data) => {
      let imgBase64 = Buffer.from(data.image).toString("base64");
      const response = data;
      response.image = `data:image/jpeg;base64,${imgBase64}`;
      res.status(200).json(success("Success", response, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.getResepFavorited = (req, res) => {
  const { page, size } = req.query;
  const userId = req.params.userId;
  const { limit, offset } = getPagination(page - 1, size);
  if (!userId) {
    res.status(400).json(success("ID not found", "", 404));
    return;
  }
  Resep.findAndCountAll({
    // where: {
    //   '$favorites.userId$': {
    //     [Op.eq] : userId
    //   }
    // },
    include: [
      {
        model: Favorite,
        required: true,
        as: "favorites",
        subQuery: false,
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
      },
    ],
    attributes: [
      "id",
      "nama",
      "bahanBahan",
      "caraPembuatan",
      "energi",
      "karbohidrat",
      "lemak",
      "protein",
      "porsi",
      "image",
      "umur",
      "beratBadan"
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = paginationData(data, page, limit);
      res.status(200).json(success("Success", response, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.getAllResep = (req, res) => {
  const { page, size, userId, search } = req.query;
  const { limit, offset } = getPagination(page - 1, size);

  Resep.findAndCountAll({
    where: {
      [Op.or]: {
        nama: {
          [Op.like]: '%' + search + '%'
        },
      }
    },
    include: {
      model: Favorite,
      required: false,
      where: userId
        ? {
            userId: userId,
          }
        : {},
      attributes: ["userId"],
    },
    attributes: [
      "id",
      "nama",
      "bahanBahan",
      "caraPembuatan",
      "energi",
      "karbohidrat",
      "lemak",
      "protein",
      "porsi",
      "image",
      "umur",
      "beratBadan"
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = paginationData(data, page, limit);
      res.status(200).json(success("Success", response, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.getRekomendasiResep = (req, res) => {
  const { page, size, userId, umur, beratBadan } = req.query;
  const { limit, offset } = getPagination(page - 1, size);

  Resep.findAndCountAll({
    where: {
      [Op.or]: [
        beratBadan ? {
          beratBadan: {
            [Op.lte]: beratBadan
          }
        } : {},
        umur ? {
          [Op.and]: [
              db.Sequelize.literal(`CONVERT(SUBSTRING_INDEX(umur, '-', 1), UNSIGNED) <= ${umur}`),
              db.Sequelize.literal(`CONVERT(SUBSTRING_INDEX(umur, '-', -1), UNSIGNED) >= ${umur}`)
            ]
        } : {}
      ]
    },
    include: {
      model: Favorite,
      required: false,
      where: userId
        ? {
            userId: userId,
          }
        : {},
      attributes: ["userId"],
    },
    attributes: [
      "id",
      "nama",
      "bahanBahan",
      "caraPembuatan",
      "energi",
      "karbohidrat",
      "lemak",
      "protein",
      "porsi",
      "image",
      "umur",
      "beratBadan"
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = paginationData(data, page, limit);
      res.status(200).json(success("Success", response, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.delete = (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).json(success('Not found', null, 400))
    return;
  }

  Resep.destroy({ where: { id: id } })
    .then((_) => {
      res.status(200).json(success('Success', null, 200))
    }).catch((e) => {
      res.status(500).json(success(e.message, null, 500))
    })
}

const bodyReq = (req) => {
  const body = {
    nama: req.body.nama,
    bahanBahan: req.body.bahanBahan,
    caraPembuatan: req.body.caraPembuatan,
    energi: req.body.energi,
    karbohidrat: req.body.karbohidrat,
    lemak: req.body.lemak,
    protein: req.body.protein,
    porsi: req.body.porsi,
    imageName: req.file.originalname,
    image: fs.readFileSync(
      __basedir + "/resources/static/assets/uploads/" + req.file.filename
    ),
    umur: req.body.umur,
    beratBadan: req.body.beratBadan
  };
  return body;
};
