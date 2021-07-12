var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: "nguyentheanhbmt1112000@gmail.com",
      pass: "05003843100",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);
