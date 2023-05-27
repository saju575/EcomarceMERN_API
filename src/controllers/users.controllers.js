const createError = require("http-errors");
const User = require("../models/user.models");
const { successResponse } = require("./response.controllers");

//export all matching users functions
exports.getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    //regular expression for searching keyword
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    //filter for search users
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    //options for find method
    const options = {
      password: 0,
      __v: 0,
    };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    //count number of users

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "No user found");

    // return all matching users
    return successResponse(res, {
      statusCode: 200,
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page * limit < count ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
