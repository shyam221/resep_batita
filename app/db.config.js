module.exports = {
  HOST: "103.67.187.61",
  USER: "syahrul",
  PASSWORD: "hissatsu",
  DB: "resep_makanan",
  dialect: "mysql",
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 1000000
  }
};
