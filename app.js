require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const generalInfoRouter = require("./routes/generalInfo");
const educationRouter = require("./routes/education");
const projectRouter = require("./routes/projects");
const languageRouter = require("./routes/languages");
const experienceRouter = require("./routes/experiences");
const skillRouter = require("./routes/skills");
const websiteRouter = require("./routes/websites");
const apiRouter = require("./routes/apis");

const app = express();
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
app.use("/apis", apiRouter);

module.exports = app;
