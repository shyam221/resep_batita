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
          umur: body.umur,
          beratBadan: body.beratBadan,
          resepId: data.id,
          
        }).then(async (detail) => {
          const bahanBahan = []
          for (const bahan of req.body.bahanBahan) {
            const bahanUpdate = bahan
            bahanUpdate.detail_resep_id = detail.id
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
      console.log(data)
      DetailResep.update({
        caraPembuatan: body.caraPembuatan,
        energi: body.energi,
        karbohidrat: body.karbohidrat,
        lemak: body.lemak,
        protein: body.protein,
        porsi: body.porsi,
        umur: body.umur,
        beratBadan: body.beratBadan,
        resepId: data.id,
        
      }, {
        where: {
          resepId: req.params.id
        }
      }).then(async (detail) => {
        const bahanBahan = []
        for (const bahan of req.body.bahanBahan) {
          const bahanUpdate = bahan
          bahanUpdate.detail_resep_id = req.body.detailResepId
          bahanBahan.push(bahanUpdate)
        }
        await BahanResep.destroy({
          where: {
            detail_resep_id: req.body.detailResepId
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
        include: [
            {
              model: BahanResep
            }
        ]
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

exports.contentBased = function(recommender) {
  return async function(req, res) {
    const resepId = req.params.resepId
    const userId = req.params.userId
    const obj = recommender.export
    const size = await Resep.count()
    // mengecek data yang tersimpan di content based
    if (obj.data) {
      //jika data yang tersimpan tidak sama dengan yang di database, akan di import baru
      if (size > obj.data.length) {
        Resep.findAll({include: [
          {
            model: DetailResep,
            required: true
          }
        ]}).then(async (data) => {
          const listResep = await listDataResep(data)
          recommender.train(listResep)
        })
      }
    } else {
      // jika tidak ada data yang tersimpan, data akan di train
      await Resep.findAll({
        include: [
          {
            model: DetailResep,
            required: true
          }
        ]
      }).then(async (data) => {
        const listResep = await listDataResep(data)
        recommender.train(listResep)
      })
    }
    // mengambil data yang berhasil di train, yang mempunyai kemiripan dengan resep berdasarkan id yang telah dikirimkan oleh user
    const similarDocuments = await recommender.getSimilarDocuments(resepId, 0, 10);
    console.log(similarDocuments)
    const idSimilarDocument = []
    // jika ada data yang sama, id-id tersebut akan dimasukan ke dalam array
    await similarDocuments.forEach(element => {
      idSimilarDocument.push(element.id)
    });
    // mencari data dengan id-id yang telah dimasukan ke dalam array di atas
    Resep.findAll({
      where: {
        id: {
          [Op.in]: idSimilarDocument
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
      ]
    }).then(async (data) => {
      const response = await listDataResep(data);
      res.status(200).json(success("Success", response, "200"));
    }).catch((err) => {
      res
          .status(500)
          .json(success("Terjadi error saat " + err.message, "", 500));
    })
  }
}

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
              db.Sequelize.literal(`CONVERT(SUBSTRING_INDEX(detail_resep.umur, '-', 1), UNSIGNED) <= ${umur}`),
              db.Sequelize.literal(`CONVERT(SUBSTRING_INDEX(detail_resep.umur, '-', -1), UNSIGNED) >= ${umur}`)
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
    umur: req.body.umur,
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
