module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("user", {
    nama: {
      type: Sequelize.STRING
    },
    nomor: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  })
  return Users
}
