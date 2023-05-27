const express = require("express");
const morgan = require("morgan");
const createErrors = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/users.routers");
const seedUserRouter = require("./routers/seedUser.routers");
// make app

const app = express();

//rate limit of request per minute

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "To many requests from this IP. Please try again later.",
});

// middileware
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//seed user
app.use("/api/seed", seedUserRouter);

// get users
app.use("/api/users", userRouter);

//client error handling

app.use((req, res, next) => {
  next(createErrors(404, "Route not found"));
});

//server error handling ->  all the error come here

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  return res
    .status(errorStatus)
    .json({ success: false, status: errorStatus, message: err.message });
});

module.exports = app;
