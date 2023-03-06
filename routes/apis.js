var express = require("express");
var router = express.Router();
const User = require("../models/users");
const General = require("../models/generals");
const Education = require("../models/educations");
const Project = require("../models/projects");
const Language = require("../models/languages");
const Experience = require("../models/experiences");
const Skill = require("../models/skills");
const Website = require("../models/websites");

router.get("/:token", async (req, res) => {
  const userData = await User.findOne({ token: req.params.token }).select(
    "-password"
  );
  const generalData = await General.findOne({ user: userData._id });
  const languageData = await Language.find({ user: userData._id });
  const projectData = await Project.find({ user: userData._id });
  const educationData = await Education.find({ user: userData._id });
  const skillData = await Skill.find({ user: userData._id });
  const websiteData = await Website.find({ user: userData._id });
  const experienceData = await Experience.find({ user: userData._id });

  res.json({
    user: userData,
    general: generalData,
    languages: languageData,
    projects: projectData,
    educations: educationData,
    skills: skillData,
    websites: websiteData,
    experiences: experienceData,
  });
});

module.exports = router;
