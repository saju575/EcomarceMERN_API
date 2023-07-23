const createError = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/user.models");
const { successResponse } = require("./response.controllers");
const { findUsers, findWithId } = require("../services/findItem.services");
const { deleteImage } = require("../helper/deleteImage.helper");

//export all matching users functions

exports.getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
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

    const users = await findUsers(page, limit, filter);

    //count number of users

    const count = await User.find(filter).countDocuments();

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

//export get one user function

exports.getUserById = async (req, res, next) => {
  try {
    //get Id parameter
    const id = req.params.id;

    const options = { password: 0 };

    //get user
    const user = await findWithId(User, id, options);

    // return all matching users
    return successResponse(res, {
      statusCode: 200,
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export delete user function

exports.deleteUserById = async (req, res, next) => {
  try {
    //get Id parameter
    const id = req.params.id;

    const options = { password: 0 };

    //get user
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    if (!user.isAdmin) {
      await deleteImage(userImagePath);
    }

    // delete user

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    // return all matching users
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
