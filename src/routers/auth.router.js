const express = require("express");
const { handleLogin, handleLogout } = require("../controllers/auth.controller");

const authRouter = express.Router();

// */login router*/

authRouter.post("/login", handleLogin);

authRouter.post("/logout", handleLogout);

module.exports = authRouter;
