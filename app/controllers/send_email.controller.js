const { transporter } = require('../mail.config')
const handlebars = require('handlebars')
const fs = require('fs')

exports.emailOtp = async (user, otp, email) => {
  let html = fs.readFileSync('./app/email_template.html', 'utf8').toString();
  let template = handlebars.compile(html);
  let data = {
    user: user,
    otp: otp
  };
  console.log(data)
  let mailOptions = {
    from: 'noreply@resepanak.com',
    to: email,
    subject: 'Verifikasi Akun',
    html: template(data)
  }
  transporter.sendMail(mailOptions, (info, err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Message sent: %s', info.messageId)
  })
}

