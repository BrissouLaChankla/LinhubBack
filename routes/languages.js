var express = require("express");
var router = express.Router();
const Language = require("../models/languages");
const User = require("../models/users");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Language.find({ user: data._id })
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
      const newLanguage = new Language({
        name: req.body.name,
        proficiency: req.body.profenciency,
        user: id,
      });

      newLanguage.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

router.delete("/delete/:languageId", (req, res) => {
  Language.deleteOne({ _id: req.params.languageId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount > 0) {
      res.json({ result: true, text: "language deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
