const dbConfig = require("../db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.favorites = require("./favorite.model.js")(sequelize, Sequelize)

db.users.hasMany(db.favorites, { as: 'favorites' })
db.favorites.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
})

module.exports = db;
