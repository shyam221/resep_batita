const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: '587',
  auth: {
    user: 'alice6@ethereal.email',
    pass: 'FJM9eyF9TBSTCma2yj'
  }
})

module.exports = transporter
