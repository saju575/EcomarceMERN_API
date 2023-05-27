exports.getUsers = (req, res, next) => {
  try {
    res.send({
      message: "Everything is fine",
    });
  } catch (error) {
    next(error);
  }
};
