module.exports = (sequelize, Sequelize) => {
  const Resep = sequelize.define("resep", {
    nama: {
      type: Sequelize.STRING
    },
    bahanBahan: {
      type: Sequelize.TEXT('medium')
    },
    caraPembuatan: {
      type: Sequelize.TEXT('long')
    },
    energi: {
      type: Sequelize.DOUBLE
    },
    karbohidrat: {
      type: Sequelize.DOUBLE
    },
    lemak: {
      type: Sequelize.DOUBLE
    },
    protein: {
      type: Sequelize.DOUBLE
    },
    porsi: {
      type: Sequelize.INTEGER
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