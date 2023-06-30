const transporter = require('../mail.config')
const handlebars = require('handlebars')

module.exports = sendEmail

async function sendEmail({ from, to, subject, html }) {
  await transporter.sendMail({ from, to, subject, html })
}

const emailOtp = async (user, otp) => {
  let html = await readFile('../email_template.html', 'utf8');
  let template = handlebars.compile(html);
  let data = {
    user: user,
    otp: otp
  };
  return template(data);
}

module.exports = emailOtp
