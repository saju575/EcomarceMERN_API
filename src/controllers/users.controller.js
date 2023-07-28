const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { findUsers, findWithId } = require("../services/findItem.services");
const { createJWTToken } = require("../helper/jwt.helper");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email.helper");
const { MAX_FILE_SIZE } = require("../config/index.config");

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
    if (!user) {
      throw new Error("User not found");
    }

    // const userImagePath = user.image;

    // if (!user.isAdmin) {
    //   await deleteImage(userImagePath);
    // }

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

    // check the user provided the image or not
    let imageBufferString;
    const image = req.file;

    if (image) {
      if (image.size > MAX_FILE_SIZE) {
        throw new Error("File is too big. It must be at less then 1MB");
      } else {
        imageBufferString = image.buffer.toString("base64");
      }
    }

    // create jwt token
    const jwtToken = createJWTToken(
      {
        name,
        email,
        password,
        phone,
        address,
        gender,
        image: imageBufferString,
      },
      jwtActivationKey,
      "10m"
    );

    // prepare email
    const emailData = {
      email,
      subject: `Account Activation Email`,
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to 
      <a href="${clientURL}/api/users/activate/${jwtToken}" target="_blank">activate your account</a>
      </p>
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
      payload: { token: jwtToken },
    });
  } catch (error) {
    next(error);
  }
};

// activate user registration data store into database
exports.activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    // if token is not provided
    if (!token) throw createError(404, "Token missing");
    try {
      // decode token data
      const decoded = jwt.verify(token, jwtActivationKey);

      if (!decoded) throw createError(401, "User is not veryfied");

      //check user already exist or not

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "User with this email already exists. Please sign in."
        );
      }

      // create new user and add to db
      await User.create(decoded);
      // return success response

      return successResponse(res, {
        statusCode: 201,
        message: `User was registered successfully`,
      });
    } catch (err) {
      if (err.name === "TokenExpiredError")
        throw createError(401, "Token has expired");
      else if (err.name === "JsonWebTokenError")
        throw createError(401, "Invalid Token");
      else throw err;
    }
  } catch (error) {
    next(error);
  }
};

// update user by Id

exports.updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // check that the user exists or not
    await findWithId(User, userId);

    const updateOptions = { new: true, runValidators: true, context: "query" };
    // update name, password, phone, image, address, gender

    let updateInfo = {};

    for (let key in req.body) {
      if (
        ["name", "password", "phone", "image", "address", "gender"].includes(
          key
        )
      ) {
        updateInfo[key] = req.body[key];
      }
    }
    // image size and image into buffer string

    const image = req.file;

    if (image) {
      imageBufferString = image.buffer.toString("base64");
      if (image.size > MAX_FILE_SIZE) {
        throw new Error("File is too big. It must be at less then 1MB");
      } else {
        updateInfo.image = image.buffer.toString("base64");
      }
    }

    //update user into Database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateInfo,
      updateOptions
    ).select("-password");

    // if not updated user

    if (!updatedUser) {
      throw new Error("User with this id does not exist");
    }
    return successResponse(res, {
      statusCode: 201,
      message: `User was registered successfully`,
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
