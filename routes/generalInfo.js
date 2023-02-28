var express = require("express");
var router = express.Router();
const General = require("../models/generals");
const User = require("../models/users");

//chercher grâce au params(token) le user avec un User.findOne({ token: req.params.token })
//utiliser le user id pour chercher le document dans général
//afficher général
router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      General.findOne({ user: data._id })
        .populate("user")
        .then((data) => {
          console.log(data);
          res.json({
            result: true,
            res: data,
          });
        });
    }
  });
});

//permet de créer/éditer les infos generales de l'utilisateur
//On cherche d'abord le user avec son token pour récuperer son id
//puis on cherche dans la collection "generals" un un document General
//qui contient l'id du user cherché précédemment , une fois trouvée
//on modifie ce document avec General.findOne
router.post("/update/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      General.findOne({ user: data._id })
        .populate("user")
        .then((data) => {
          console.log(data);
          General.updateOne(
            { _id: data._id },
            {
              general: {
                birthDate: req.body.birthDate,
                adress: req.body.adress,
                description: req.body.description,
                headline: req.body.headline,
                yearExperience: req.body.yearExperience,
                currentJob: req.body.currentJob,
                // profilePicture: req.body.profilePicture,
                // backgroundPicture: req.body.backgroundPicture,
                urlLinkedIn: req.body.urlLinkedIn,
              },
            }
          ).then((data) =>
            res.json({
              result: true,
              res: "your profile was updated",
              update: data,
            })
          );
        });
    }
  });
});

module.exports = router;
