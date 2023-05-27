const express = require("express");
const morgan = require("morgan");
const createErrors = require("http-errors");
// make app

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Everything is fine",
  });
});

//client error handling

app.use((req, res, next) => {
  next(createErrors(404, "Route not found"));
});

//server error handling

app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ success: false, message: err.message });
});

module.exports = app;
