module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("user", {
    nama: {
      type: Sequelize.STRING
    },
    nomor: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    tanggalLahir: {
      type: Sequelize.DATEONLY
    },
    beratBadan: {
      type: Sequelize.INTEGER
    },
    fotoProfil: {
      type: Sequelize.BLOB('long')
    },
    namaFotoProfil: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM('ADMIN', 'USER')
    },
    password: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    otp: {
      type: Sequelize.STRING
    },
    otpPassword: {
      type: Sequelize.STRING
    }
  })
  return Users
}
