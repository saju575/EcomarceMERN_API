const mongoose = require("mongoose");
const createError = require("http-errors");
const User = require("../models/user.models");

//find many users

exports.findUsers = async (page = 1, limit = 5, filter = {}) => {
  try {
    //options for find method
    const options = {
      password: 0,
      __v: 0,
    };

    //find users
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    if (!users || users.length === 0) throw createError(404, "No user found");

    return users;
  } catch (error) {
    throw error;
  }
};

//find one user

exports.findUser = async (id) => {
  //options for find method
  try {
    const options = {
      password: 0,
      __v: 0,
    };
    const user = await User.findById(id, options);
    if (!user || user.length === 0) throw createError(404, "No user found");
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(404, "Invalid user ID");
    }
    throw error;
  }
};
