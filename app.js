require("dotenv").config();
const path = require("path");
const express = require("express");
const flash = require('express-flash');
const app = express();

//connects to DB
require("./db");

// middleware
require("./config")(app);

// register helpers for hbs
require("./middleware/hbs");

// sessions
require("./config/session.config")(app);
app.use(flash());

// routers
const indexRouter = require("./routes/index.routes");
app.use("/", indexRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const usersRouter = require("./routes/users.routes");
app.use("/users", usersRouter);

const animalsRouter = require("./routes/animals.routes");
app.use("/animals", animalsRouter);

const sheltersRouter = require("./routes/shelters.routes");
app.use("/shelters", sheltersRouter);

module.exports = app;
