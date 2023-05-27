// For use of error response
exports.errorResponse = (
  res,
  { statusCode = 500, message = "Internal Server Error" }
) => {
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

// For use of success response
exports.successResponse = (
  res,
  { statusCode = 200, message = "Success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    payload,
  });
};
