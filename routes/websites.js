var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Website = require("../models/websites");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Website.find({ user: data._id })
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
      const newWebsite = new Website({
        name: req.body.name,
        label: req.body.label,
        url: req.body.url,
        user: id,
      });

      newWebsite.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

router.delete("/delete/:websiteId", (req, res) => {
  Website.deleteOne({ _id: req.params.websiteId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount > 0) {
      res.json({ result: true, text: "website deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
