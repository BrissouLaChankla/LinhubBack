var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Skill = require("../models/skills");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Skill.find({ user: data._id })
        // .populate("user")
        .then((data) => {
          console.log(data);
          res.json({
            result: true,
            data: data,
          });
        });
    } else {
      res.json({ result: false, error: "An error occured" });
    }
  });
});

router.post("/create/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data);
      const id = data._id;

      const newSkill = new Skill({
        name: req.body.skills,
        user: id,
      });

      newSkill.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

router.delete("/delete/:skillId", (req, res) => {
  Skill.deleteOne({ _id: req.params.skillId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount > 0) {
      res.json({ result: true, text: "skill deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
