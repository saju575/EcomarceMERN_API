const express = require("express");
const { seedUsers } = require("../controllers/seedUsers.controllers");

const seedUserRouter = express.Router();

seedUserRouter.get("/users", seedUsers);

module.exports = seedUserRouter;
