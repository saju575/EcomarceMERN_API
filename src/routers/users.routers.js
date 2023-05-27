const express = require("express");
const { getUsers } = require("../controllers/users.controllers");

const userRouter = express.Router();

//get all users
userRouter.get("/all", getUsers);

module.exports = userRouter;
