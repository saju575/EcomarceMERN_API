require("dotenv").config();

exports.serverPort = process.env.SERVER_PORT;

exports.mongodbURL = process.env.MONGODB_URL;

exports.defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpg";
