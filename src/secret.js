require("dotenv").config();

exports.serverPort = process.env.SERVER_PORT;

exports.mongodbURL = process.env.MONGODB_URL;

exports.defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpg";

exports.jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "jdkekkw^^555%7";

exports.jwtAccessKey = process.env.JWT_ACCESS_KEY;

exports.smtpUserName = process.env.SMTP_EMAIL;

exports.smtpUserPassword = process.env.SMTP_EMAIL_PASS;
exports.clientURL = process.env.CLIENT_URL;
