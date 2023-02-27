var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");

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

module.exports = router;
