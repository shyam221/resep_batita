module.exports = (sequelize, Sequelize) => {
  const Resep = sequelize.define("resep", {
    nama: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.BLOB('long')
    },
    imageName: {
      type: Sequelize.STRING
    }
  })
  return Resep
}