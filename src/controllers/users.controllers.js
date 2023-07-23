const createError = require("http-errors");

const User = require("../models/user.models");
const { successResponse } = require("./response.controllers");
const { findUsers, findWithId } = require("../services/findItem.services");
const { deleteImage } = require("../helper/deleteImage.helper");
const { createJWTToken } = require("../helper/jwt.helper");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email.helper");

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

// process email registration for post request
exports.procesRegister = async (req, res, next) => {
  try {
    //destructure all registration data

    const { name, email, password, phone, address, gender } = req.body;

    //check user already exist or not

    const userExists = await User.exists({ email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists. Please sign in."
      );
    }

    // create jwt token
    const jwtToken = createJWTToken(
      { name, email, password, phone, address, gender },
      jwtActivationKey,
      "10m"
    );

    // prepare email
    const emailData = {
      email,
      subject: `Account Activation Email`,
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${jwtToken}" target="_blank">activate your account</a></p>
      `,
    };
    // send email with nodemail

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send varification email"));
      return;
    }

    // return success response

    return successResponse(res, {
      statusCode: 200,
      message: `Please got to your ${email} for completing your registration process`,
    });
  } catch (error) {
    next(error);
  }
};
