require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var generalInfoRouter = require("./routes/generalInfo");
var educationRouter = require("./routes/education");
var projectRouter = require("./routes/projects");
var languageRouter = require("./routes/languages");
var experienceRouter = require("./routes/experiences");
var skillRouter = require("./routes/skills");
var websiteRouter = require("./routes/websites");

var app = express();
const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/generalInfo", generalInfoRouter);
app.use("/education", educationRouter);
app.use("/projects", projectRouter);
app.use("/languages", languageRouter);
app.use("/experiences", experienceRouter);
app.use("/skills", skillRouter);
app.use("/websites", websiteRouter);

module.exports = app;
