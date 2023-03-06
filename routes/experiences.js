var express = require("express");
var router = express.Router();
const Experience = require("../models/experiences");
const User = require("../models/users");

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Experience.find({ user: data._id })
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

// get a single experience detailled
router.get("/:experienceID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Experience.findOne({ user: data._id, _id: req.params.experienceID }).then(
        (data) => {
          console.log(data);
          res.json({
            result: true,
            data: data,
          });
        }
      );
    } else {
      res.json({ error: "An error occured" });
    }
  });
});

/* Update une experience */
router.put("/:experienceID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Experience.updateOne({ _id: req.params.experienceID }, req.body).then(
        (data) => {
          console.log(data);
          res.json({
            result: true,
            data,
          });
        }
      );
    } else {
      res.json({ error: "User not found" });
    }
  });
});

router.post("/create/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data);
      const id = data._id;
      const newExperience = new Experience({
        company: req.body.company,
        description: req.body.description,
        location: req.body.location,
        locationString: req.body.locationString,
        title: req.body.title,
        startMonthYear: req.body.startMonthYear,
        endMonthYear: req.body.endMonthYear,
        typeOfContract: req.body.typeOfContract,
        user: id,
      });

      newExperience.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

router.delete("/delete/:experienceId", (req, res) => {
  Experience.deleteOne({ _id: req.params.experienceId }).then((data) => {
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
