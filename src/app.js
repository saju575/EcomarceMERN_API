const express = require("express");
const morgan = require("morgan");
const createErrors = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/users.router");
const seedUserRouter = require("./routers/seedUser.router");
const { errorResponse } = require("./controllers/response.controller");
const authRouter = require("./routers/auth.router");
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//seed user
app.use("/api/seed", seedUserRouter);

//  users signup, get, delete, update routes
app.use("/api/users", userRouter);

// users signin routes

app.use("/api/users/auth", authRouter);

//client error handling

app.use((req, res, next) => {
  next(createErrors(404, "Route not found"));
});

//server error handling ->  all the error come here

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
