const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  procesRegister,
} = require("../controllers/users.controllers");

const userRouter = express.Router();

// process registration or register user

userRouter.post("/process-register", procesRegister);

//get all users

userRouter.get("/all", getUsers);

// get userById and delete user by id
userRouter.route("/:id").get(getUserById).delete(deleteUserById);

module.exports = userRouter;
