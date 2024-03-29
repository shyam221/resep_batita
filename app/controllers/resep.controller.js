const db = require("../model");
const fs = require("fs");
const Resep = db.resep;
const DetailResep = db.detailResep
const BahanResep = db.bahanResep
const Favorite = db.favorites;
const Op = db.Sequelize.Op;
const literal = db.Sequelize.literal
const {
  detailResepRes
} = require("../response/resep.response");

const {
  success,
  getPagination,
  paginationDataResep,
  listDataResep
} = require("../base/response.base");

exports.createResep = async (req, res) => {
  const body = await bodyReq(req);
  Resep.create({
    nama: body.nama,
    imageName: body.imageName,
    image: body.image,
  })
    .then((data) => {
        fs.writeFileSync(
          __basedir + "/resources/static/assets/tmp/" + data.imageName,
          data.image
        );
        DetailResep.create({
          caraPembuatan: body.caraPembuatan,
          energi: body.energi,
          karbohidrat: body.karbohidrat,
          lemak: body.lemak,
          protein: body.protein,
          porsi: body.porsi,
          sumber: body.sumber,
          untukUmur: body.untukUmur,
          sampaiUmur: body.sampaiUmur,
          beratBadan: body.beratBadan,
          resepId: data.id,
          
        }).then(async (detail) => {
          const bahanBahan = []
          for (const bahan of JSON.parse(body.bahanBahan)) {
            const bahanUpdate = bahan
            bahanUpdate.resep_id = data.id
            bahanBahan.push(bahanUpdate)
          }
          BahanResep.bulkCreate(bahanBahan)
            .then((a) => {
              console.log(a)
              res.status(200).json(success("Success", detail, "200"));
            }).catch((err) => {
              console.error(err)
              res
                .status(500)
                .json(success("Terjadi error saat " + err.message, "", 500));
            })
          })
      })
    .catch((err) => {
      console.error(err)
      res
        .status(500)
        .json(success("Terjadi error saat " + err.message, "", 500));
    });
};

exports.updateResep = async (req, res) => {
  const body = await bodyReq(req);

  Resep.update({
    nama: body.nama,
    imageName: body.imageName,
    image: body.image
  }, {
    where: {
      id: req.params.id,
    }
  })
    .then((data) => {
      DetailResep.update({
        caraPembuatan: body.caraPembuatan,
        energi: body.energi,
        karbohidrat: body.karbohidrat,
        lemak: body.lemak,
        protein: body.protein,
        porsi: body.porsi,
        untukUmur: body.untukUmur,
        sampaiUmur: body.sampaiUmur,
        sumber: body.sumber,
        beratBadan: body.beratBadan,
        resepId: data.id,
        
      }, {
        where: {
          resepId: req.params.id
        }
      }).then(async (detail) => {
        const bahanBahan = []
        for (const bahan of JSON.parse(body.bahanBahan)) {
          const bahanUpdate = {}
          bahanUpdate.resep_id = req.params.id
          bahanUpdate.bahan_bahan = bahan
        }
        await BahanResep.destroy({
          where: {
            resep_id: req.params.id
          }
        })
        BahanResep.bulkCreate(bahanBahan)
          .then((a) => {
            console.log(a)
            res.status(200).json(success("Success", detail, "200"));
          }).catch((err) => {
            console.error(err)
            res
              .status(500)
              .json(success("Terjadi error saat " + err.message, "", 500));
          })
        })
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

  Resep.findByPk(resepId, {
    include: [
      {
        model: DetailResep,
        required: true,
      },
      {
        model: BahanResep
      }
    ]
  })
    .then(async (data) => {
      let imgBase64 = Buffer.from(data.image).toString("base64");
      const image = await `data:image/jpeg;base64,${imgBase64}`;
      
      const response = detailResepRes(data, image);
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
      {
        model: DetailResep,
        required: true
      }
    ],
    limit,
    offset,
  })
    .then(async (data) => {
      const response = await paginationDataResep(data, page, limit);
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
    include: [
      {
        model: Favorite,
        required: false,
        where: userId
          ? {
              userId: userId,
            }
          : {},
        attributes: ["userId"],
      },
      {
        model: DetailResep,
        required: true
      }
    ],
    limit,
    offset,
  })
    .then(async (data) => {
      const response = await paginationDataResep(data, page, limit);
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
          '$detail_resep.beratBadan$': {
            [Op.lte]: beratBadan
          }
        } : {},
        umur ? {
          [Op.and]: [
              db.Sequelize.literal(`SUBSTRING_INDEX(detail_resep.untukUmur, ' ', 1) <= ${umur}`),
              db.Sequelize.literal(`SUBSTRING_INDEX(detail_resep.sampaiUmur, ' ', 1) >= ${umur}`)
            ]
        } : {}
      ]
    },
    include: [
      {
        model: Favorite,
        required: false,
        where: userId
          ? {
              userId: userId,
            }
          : {},
        attributes: ["userId"],
      },
      {
        model: DetailResep,
        required: true
      }
    ],
    limit,
    offset,
  })
    .then(async (data) => {
      const response = await paginationDataResep(data, page, limit);
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

const bodyReq = async (req) => {
  const body = await {
    nama: req.body.nama,
    bahanBahan: req.body.bahanBahan,
    caraPembuatan: req.body.caraPembuatan,
    energi: req.body.energi,
    karbohidrat: req.body.karbohidrat,
    lemak: req.body.lemak,
    protein: req.body.protein,
    porsi: req.body.porsi,
    sumber: req.body.sumber,
    untukUmur: req.body.untukUmur,
    sampaiUmur: req.body.sampaiUmur,
    beratBadan: req.body.beratBadan
  };
  if (req.file) {
    body.imageName = req.file.originalname
    body.image = fs.readFileSync(
      __basedir + "/resources/static/assets/uploads/" + req.file.filename
    )
  }
  return body;
};
