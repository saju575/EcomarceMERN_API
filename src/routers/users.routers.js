const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  procesRegister,
  activateUserAccount,
  updateUserById,
} = require("../controllers/users.controllers");

const { upload } = require("../middlewares/uploadFile.middleware");
const {
  userRegistrationValidation,
  handleUnknownFieldsOfUserResgistration,
} = require("../validators/auth.validator");
const { runValidation } = require("../validators/run.validator");

const userRouter = express.Router();

// process registration or register user

userRouter.post(
  "/process-register",
  upload.single("image"),
  handleUnknownFieldsOfUserResgistration,
  userRegistrationValidation,
  runValidation,
  procesRegister
);

// verify registration and add user to db

userRouter.post("/register-verify", activateUserAccount);

//get all users

userRouter.get("/all", getUsers);

// get userById and delete user by id and update userById
userRouter
  .route("/:id")
  .get(getUserById)
  .delete(deleteUserById)
  .patch(updateUserById);

module.exports = userRouter;
