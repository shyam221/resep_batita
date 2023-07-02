const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: "nijisimp447@gmail.com",
    pass: "zddvzphclzcdvumu"
  },
  debug: true,
  logger: true 
});

module.exports.transporter = transport
