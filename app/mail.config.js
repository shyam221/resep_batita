const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "55090b74ab88f1",
    pass: "ce4af92c31a3a0"
  }
});

module.exports.transporter = transport
