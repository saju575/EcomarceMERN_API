const createError = require("http-errors");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { createJWTToken } = require("../helper/jwt.helper");
const { jwtAccessKey } = require("../secret");

exports.handleLogin = async (req, res, next) => {
  try {
    // work flow
    // email, password
    const { email, password } = req.body;
    // isExist the email in DB
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createError(404, "User not found.Please register first.");
    }
    // compare the password

    const isPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordsMatch) {
      throw createError(401, "Email/password mismatch");
    }
    // isBanned or not
    if (user.isBanned) {
      throw createError(403, "You are banned. Please contact authorities");
    }
    // token, cookie

    const accessToken = createJWTToken({ email }, jwtAccessKey, "1h");
    //set cookie
    res.cookie("access_token", accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // successful response
    return successResponse(res, {
      statusCode: 200,
      message: "User were logged in successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// Logout

exports.handleLogout = async (req, res, next) => {
  try {
    //clear cookies
    res.clearCookie("access_token");
    // successful response
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
