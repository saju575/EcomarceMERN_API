const nodemailer = require("nodemailer");
const { smtpUserName, smtpUserPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUserName,
    pass: smtpUserPassword,
  },
});

exports.emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
