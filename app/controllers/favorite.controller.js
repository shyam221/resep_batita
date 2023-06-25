const db = require("../model");
const Favorite = db.favorites;
const User = db.users;
const Resep = db.resep;

const Op = db.Sequelize.Op;
const {
  success,
  getPagination,
  paginationData,
} = require("../base/response.base");

exports.addToFavorite = (req, res) => {
  if (!req.body.resepId && !req.body.userId) {
    res.status(400).json(success("Field required", "", 400));
    return;
  }
  const favorite = {
    resepId: req.body.resepId,
    userId: req.body.userId,
  };
  console.log(favorite);
  Favorite.create(favorite)
    .then((data) => {
      res.status(200).json(success("Success", data, 200));
    })
    .catch((err) => {
      res
        .status(500)
        .json(
          success(err.message || "Terjadi error saat create favorite", "", 500)
        );
    });
};

exports.deleteFavorite = (req, res) => {
  const id = req.params.id;

  Favorite.findByPk(id)
    .then((data) => {
      res.status(200).json(success("Success", data, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.deleteFavoriteByUserAndResep = (req, res) => {
  const { userId, resepId } = req.params;

  Favorite.destroy({ where: { userId: userId, resepId: resepId } })
    .then((data) => {
      res.status(200).json(success("Success", null, "200"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat ", "", 500));
    });
};

exports.findAll = (req, res) => {
  const { page, size, search } = req.query;

  const { limit, offset } = getPagination(page - 1, size);

  Favorite.findAndCountAll({
    include: [
      {
        model: User,
        required: true,
        as: "user",
        attributes: ["nama"],
      },
      {
        model: Resep,
        required: true,
        as: "resep",
        attributes: ["nama", "energi", "umur", "beratBadan"],
      },
    ],
    where: {
      [Op.or]: {
        "$user.nama$": {
          [Op.like]: "%" + search + "%",
        },
        "$resep.nama$": {
          [Op.like]: "%" + search + "%",
        },
      },
    },
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
        .json(success(err.message || "Terjadi error saat fetch data", "", 500));
    });
};

exports.getFavorite = (req, res) => {
  const id = req.params.id;

  Favorite.findByPk(id, {
    include: [
      {
        model: User,
        required: true,
        as: "user",
      },
      {
        model: Resep,
        required: true,
        as: "resep",
      },
    ],
  })
    .then((data) => {
      res.status(200).json(success("Success", data, 200));
    })
    .catch((err) => {
      res
        .status(500)
        .json(success(err.message || "Terjadi error saat fetch data", "", 500));
    });
};
