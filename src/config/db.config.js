const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.info("Connected to MongoDB successfully");
    mongoose.connection.on("error", (err) => {
      console.error(err.message);
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
