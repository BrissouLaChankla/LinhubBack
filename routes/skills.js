var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Skill = require("../models/skills");
const { checkBody } = require("../modules/checkBody");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Skill.find({ user: data._id })
        // .populate("user")
        .then((data) => {
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
  if (!checkBody(req.body, ["skills"])) {
    res.json({
      result: false,
      error: "Missing or empty fields",
      erreur: "Champs manquant ou incorrect",
    });
    return;
  }
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      const id = data._id;
      Skill.updateOne({ user: id }, { $push: { name: req.body.skills } }).then(
        (data) => {
          console.log("data", data);
          data.modifiedCount > 0 && res.json({ result: true });
        }
      );
    } else {
      res.json({ result: false });
    }
  });
});

router.post("/delete/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      const id = data._id;

      Skill.updateOne(
        { user: id },
        { $pull: { name: req.body.skillname } }
      ).then((data) => {
        data.modifiedCount > 0 && res.json({ result: true });
      });
    } else {
      res.json({ result: false });
    }
  });
});

module.exports = router;
