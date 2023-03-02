var express = require("express");
var router = express.Router();
const Position = require("../models/positions");
const User = require("../models/users");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Position.find({ user: data._id })
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
      const newPosition = new Position({
        company: req.body.company,
        description: req.body.description,
        location: req.body.location,
        locationString: req.body.locationString,
        title: req.body.title,
        startMonthYear: req.body.startMonthYear,
        endMonthYear: req.body.endMonthYear,
        user: id,
      });

      newPosition.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

router.delete("/delete/:positionId", (req, res) => {
  Position.deleteOne({ _id: req.params.positionId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount > 0) {
      res.json({ result: true, text: "Position deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
