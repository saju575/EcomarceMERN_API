const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required"],
      trim: true,
      minlength: [3, "User name length must be greater than 3 characters"],
      maxlength: [32, "User name length must be less than 32 characters"],
    },
    email: {
      type: String,
      require: [true, "User emal is required"],
      trim: true,
      unique: [true, "The email you provide are used previously"],
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          );
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      require: [true, "User password is required"],
      minlength: [3, "User password length must be greater than 3 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    gender: {
      type: String,
      require: [true, "User gender is required"],
      enum: ["male", "female", "others"],
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      require: [true, "User address is required"],
    },
    phone: {
      type: String,
      require: [true, "User phone number is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = model("User", userSchema);

module.exports = User;
