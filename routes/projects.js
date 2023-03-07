var express = require("express");
var router = express.Router();
const Project = require("../models/projects");
const User = require("../models/users");

/*la route get permet de pouvoir afficher toutes les projets de l'utilisateur, elle reprends la même logique
que pour les routes generalInfo: on recherche d'abord l'utilisateur avec son token mis en params dans
la route avec un User.findOne, une fois trouvé et si le data n'est pas nul on prendra son id pour chercher
dans la collection "projects" les document contenant cet id user avec Project.find */
router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data._id);
      Project.find({ user: data._id })
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

/*cette route permet de créer un projet. Elle doit elle aussi contenir en params le token de l'utilisateur ,
  ensuite on utilisera ce token pour rechercher l'utilisateur dans la bdd, si il est trouvé, on viendra créer un nouveau 
  document dans la collection educations avec la variable newEducation, on le sauvegarde ensuite*/
router.post("/create/:token", (req, res) => {
  // if (
  //   !checkBody(req.body, ["name", "description", "startDate", "endDate", "url"])
  // ) {
  //   res.json({
  //     result: false,
  //     error: "Missing or empty fields",
  //     erreur: "Champs manquant ou incorrect",
  //   });
  //   return;
  // }
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      console.log(data);
      const id = data._id;
      const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        url: req.body.url,
        user: id,
      });

      newProject.save().then((newData) => {
        res.json({ result: true, data: newData });
      });
    } else {
      res.json({ result: false });
    }
  });
});

/* get a single project detailled */
router.get("/:projectID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Project.findOne({ user: data._id, _id: req.params.projectID }).then(
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

/* Update un projet */
router.put("/:projectID/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      Project.updateOne({ _id: req.params.projectID }, req.body).then(
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

/* cette route aura comme params l'ID du document Project qu'on souhaite supprimer, on le supprimera
   ensuite avec .deleteOne()*/
router.delete("/delete/:projectId", (req, res) => {
  Project.deleteOne({ _id: req.params.projectId }).then((data) => {
    console.log(typeof data.deletedCount);
    if (data.deletedCount > 0) {
      res.json({ result: true, text: "Project deleted" });
    } else {
      res.json({ result: false, error: "an error was accured" });
    }
    // }data.deletedCount = '1'
  });
});

module.exports = router;
