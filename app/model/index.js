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
db.resep = require('./resep.model.js')(sequelize, Sequelize)
db.admin = require('./admin.model.js')(sequelize, Sequelize)
db.bahanResep = require('./bahan_resep.model.js')(sequelize, Sequelize)
db.detailResep = require('./detail_resep.model.js')(sequelize, Sequelize)

db.users.hasMany(db.favorites, { foreignKey: 'userId' })
db.favorites.belongsTo(db.users, { foreignKey: 'userId' })
db.resep.hasMany(db.favorites, { foreignKey: 'resepId' })
db.favorites.belongsTo(db.resep, { foreignKey: 'resepId' })
db.bahanResep.belongsTo(db.detailResep, { foreignKey: 'detail_resep_id' })
db.detailResep.belongsTo(db.resep, { foreignKey: 'resepId' })
db.detailResep.hasMany(db.bahanResep, { foreignKey: 'detail_resep_id' })
db.resep.hasOne(db.detailResep)

module.exports = db;
