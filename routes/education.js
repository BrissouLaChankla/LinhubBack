var express = require("express");
var router = express.Router();
const Education = require("../models/educations");
const User = require("../models/users");

/*la route get permet de pouvoir afficher toutes les formations de l'utilisateur, elle reprends la même logique
que pour les routes generalInfo: on recherche d'abord l'utilisateur avec son token mis en params dans
la route avec un User.findOne, une fois trouvé et si le data n'est pas nul on prendra son id pour chercher
dans la collection "educations" les document contenant cet id user avec Education.find */
router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data);
      Education.find({ user: data._id }).then((data) => {
        console.log(data);
        res.json({
          result: true,
          data: data,
        });
      });
    } else {
      res.json({ error: "An error occured" });
    }
  });
});

// get a single formation detailled
router.get("/:formationID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Education.findOne({ user: data._id, _id: req.params.formationID }).then(
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

/* Update une formation */
router.put("/:formationID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Education.updateOne({ _id: req.params.formationID }, req.body).then(
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

/*cette route permet de créer une formation. Elle doit elle aussi contenir en params le token de l'utilisateur ,
ensuite on utilisera ce token pour rechercher l'utilisateur dans la bdd, si il est trouvé, on viendra créer un nouveau 
document dans la collection educations avec la variable newEducation, on le sauvegarde ensuite*/
router.post("/create/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data);
      const id = data._id;
      const newEducation = new Education({
        schoolName: req.body.schoolName,
        degreeName: req.body.degreeName,
        fieldOfStudyName: req.body.fieldOfStudyName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        obtainedResult: req.body.result,
        // activitiesAndAssociations: req.body.activitiesAndAssociations,
        description: req.body.description,
        user: id,
      });

      newEducation.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    }
  });
});

/* cette route aura comme params l'ID du document Education qu'on souhaite supprimer, on le supprimera
 ensuite avec .deleteOne()*/
router.delete("/delete/:educationId", (req, res) => {
  Education.deleteOne({ _id: req.params.educationId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount === 1) {
      res.json({ result: true, text: "Education deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
