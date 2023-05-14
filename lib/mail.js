const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EUREKA_MAIL_USERNAME,
    pass: process.env.EUREKA_MAIL_PASSWORD,
    clientId: process.env.EUREKA_OAUTH_CLIENTID,
    clientSecret: process.env.EUREKA_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.EUREKA_OAUTH_REFRESH_TOKEN,
  },
});

const getMailOptions = ({ from, to, subject, text, html }) => ({
  from: `"${from}" <${process.env.EUREKA_MAIL_USERNAME}>`, // sender address
  to: to, // list of receivers
  subject: subject, // Subject line
  text: text, // plain text body
  html: html,
});

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = { sendMail, getMailOptions };
