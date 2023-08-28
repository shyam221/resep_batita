module.exports = (sequelize, Sequelize) => {
  const DetailResep = sequelize.define('detail_resep', {
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
    umur: {
      type: Sequelize.STRING
    },
    beratBadan: {
      type: Sequelize.STRING
    },
    sumber: {
      type: Sequelize.STRING
    }
  })
  return DetailResep
}