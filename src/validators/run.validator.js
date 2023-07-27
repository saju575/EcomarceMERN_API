const { validationResult } = require("express-validator");
const { errorResponse } = require("../controllers/response.controller");

exports.runValidation = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors);
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
