module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
  }, {
    tableName: 'favorit'
  })
  return Favorite
}
