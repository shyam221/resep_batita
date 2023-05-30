const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
    idResep: {
      type: Sequelize.STRING
    },
    nama: {
      type: Sequelize.STRING
    },
    jumlahKkl: {
      type: Sequelize.STRING
    }
  })
  return Favorite
}
