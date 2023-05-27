const express = require("express");
const { getUsers, getUser } = require("../controllers/users.controllers");

const userRouter = express.Router();

//get all users

userRouter.get("/all", getUsers);

// get user by id

userRouter.get("/:id", getUser);

module.exports = userRouter;
