var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const General = require("../models/generals");
const Education = require("../models/educations");
const Project = require("../models/projects");
const Language = require("../models/languages");
const Position = require("../models/positions");
const Skill = require("../models/skills");
const Website = require("../models/websites");

/* GET users listing. */
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "email", "password"])) {
    res.json({
      result: false,
      error: "Missing or empty fields",
      erreur: "Champs manquant ou incorrect",
    });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newData) => {
        const newGeneral = new General({
          user: newData._id,
        });
        newGeneral.save();
        res.json({
          result: true,
          email: newData.email,
          firstname: newData.firstname,
          lastname: newData.lastname,
          token: newData.token,
        });
      });
    } else {
      res.json({
        result: false,
        error: "Email already took",
        erreur: "Email déjà utilisé",
      });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({
      result: false,
      error: "Missing or empty fields",
      erreur: "Champs manquant ou incorrect",
    });
    return;
  }

  User.findOne({ username: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        lastname: data.lastname,
        firstname: data.firstname,
        email: data.email,
      });
    } else {
      res.json({
        result: false,
        error: "Email not found or wrong password",
        erreur: "Email non valide ou mot de pass éroné",
      });
    }
  });
});

router.delete("/delete/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      const userId = data._id;
      console.log(data);
      General.deleteOne({ user: userId }).then((data) => {
        if (data.deletedCount >= 0) {
          Education.deleteMany({ user: userId }).then((data) => {
            if (data.deletedCount >= 0) {
              Project.deleteMany({ user: userId }).then((data) => {
                if (data.deletedCount >= 0) {
                  Language.deleteMany({ user: userId }).then((data) => {
                    if (data.deletedCount >= 0) {
                      Skill.deleteMany({ user: userId }).then((data) => {
                        if (data.deletedCount >= 0) {
                          Position.deleteMany({ user: userId }).then((data) => {
                            if (data.deletedCount >= 0) {
                              Website.deleteMany({ user: userId }).then(
                                (data) => {
                                  if (data.deletedCount >= 0) {
                                    User.deleteOne({ _id: userId }).then(
                                      (data) => {
                                        if (data.deletedCount > 0) {
                                          res.json({
                                            result: true,
                                            res: "User deleted",
                                          });
                                        } else {
                                          res.json({
                                            result: false,
                                            error: "an error was occured 8",
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    res.json({
                                      result: false,
                                      error: "an error was occured 7",
                                    });
                                  }
                                }
                              );
                            } else {
                              res.json({
                                result: false,
                                error: "an error was occured 6",
                              });
                            }
                          });
                        } else {
                          res.json({
                            result: false,
                            error: "an error was occured 5",
                          });
                        }
                      });
                    } else {
                      res.json({
                        result: false,
                        error: "an error was occured 4",
                      });
                    }
                  });
                } else {
                  res.json({ result: false, error: "an error was occured 3" });
                }
              });
            } else {
              res.json({ result: false, error: "an error was accured 2" });
            }
          });
        } else {
          res.json({ result: false, error: "an error was accured 1" });
        }
      });
    } else {
      res.json({ result: false, error: "No user found" });
    }
    // Education.deleteMany({ user: userId });
    // Project.deleteMany({ user: userId });
    // User.deleteOne({ token: req.params.token }).then((data) => {
    //   console.log(typeof data.deletedCount);
    //   if (data.deletedCount > 0) {
    //     res.json({ result: true, text: "User deleted" });
    //   } else {
    //     res.json({ result: false, error: "an error was accured" });
    //   }
    // });
    // }data.deletedCount = '1'
  });
});

module.exports = router;
