const express = require("express");
const { seedUsers } = require("../controllers/seedUsers.controller");

const seedUserRouter = express.Router();

seedUserRouter.get("/users", seedUsers);

module.exports = seedUserRouter;
