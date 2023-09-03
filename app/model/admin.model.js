module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
    email: {
      type: Sequelize.STRING
    },
    nama: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  }, {
    tableName: 'admin'
  })
  return Admin
}
