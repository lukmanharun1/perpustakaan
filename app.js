const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();

const routes = require("./routes/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

module.exports = app;
