module.exports = (sequelize, Sequelize) => {
  const BahanResep = sequelize.define('bahan_resep', {
    bahan_bahan: {
      type: Sequelize.STRING
    }
  });
  return BahanResep
}