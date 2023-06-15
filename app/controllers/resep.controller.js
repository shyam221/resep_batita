const db = require("../model");
const fs = require("fs");
const Resep = db.resep;
const Favorite = db.favorites;
const Op = db.Sequelize.Op;

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
  const { page, size, userId, beratBadan, umur } = req.query;
  let rekomendasi = req.query.rekomendasi;
  const { limit, offset } = getPagination(page - 1, size);
  
  if (umur) {
    if (umur >= 0 && umur <= 5) {
      rekomendasi = 1
    } else if (umur >= 6 && umur <= 11) {
      rekomendasi = 2
    } else if (umur >= 12) {
      rekomendasi = 3
    }
  }

  if (beratBadan) {
    if (beratBadan <= 6) {
      rekomendasi = 1
    } else if (beratBadan > 6 && beratBadan <= 9) {
      rekomendasi = 2
    } else if (beratBadan > 10) {
      rekomendasi = 3
    } else {
      rekomendasi = 3
    }
  }

  const filter = {};
  switch (rekomendasi) {
    case 1:
      filter.energi = 550;
      filter.protein = 9;
      filter.karbohidrat = 59;
      filter.lemak = 31;
      break;

    case 2:
      filter.energi = 800;
      filter.protein = 15;
      filter.karbohidrat = 105;
      filter.lemak = 35;
      break;
    case 3:
      filter.energi = 1350;
      filter.protein = 20;
      filter.karbohidrat = 215;
      filter.lemak = 45;
      break;
    default:
      if (!umur && !beratBadan) {
        filter.energi = 1350
        filter.protein = 20
        filter.karbohidrat = 215
        filter.lemak = 45
      }
      break;
  }

  Resep.findAndCountAll({
    where: {
      [Op.and]: [
        {
          energi: {
            [Op.lte]: filter.energi,
          },
          protein: {
            [Op.lte]: filter.protein,
          },
          karbohidrat: {
            [Op.lte]: filter.karbohidrat,
          },
          lemak: {
            [Op.lte]: filter.lemak,
          },
        },
      ],
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
  };
  return body;
};
