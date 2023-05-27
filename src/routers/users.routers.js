const express = require("express");
const { getUsers } = require("../controllers/users.controllers");

const userRouter = express.Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
