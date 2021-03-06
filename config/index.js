const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const logger = require("morgan");
const path = require("path");


module.exports = (app) => {
  
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));
  hbs.registerPartials(path.join(__dirname, "..", "views", "partials"));
};
