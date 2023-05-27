const data = require("../data");
const User = require("../models/user.models");
const seedUsers = async (req, res, next) => {
  try {
    //delete all existing users
    await User.deleteMany({});

    // insert new users
    const users = await User.insertMany(data.users);
    res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUsers };
