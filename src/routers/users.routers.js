const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/users.controllers");

const userRouter = express.Router();

//get all users

userRouter.get("/all", getUsers);

// get user and delete user by id
userRouter.route("/:id").get(getUserById).delete(deleteUserById);

module.exports = userRouter;
