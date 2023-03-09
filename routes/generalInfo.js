var express = require("express");
var router = express.Router();
const General = require("../models/generals");
const User = require("../models/users");
const multer = require("multer"); //importer des fichiers
const fs = require("fs"); //supprimer des fichiers

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//chercher grâce au params(token) le user avec un User.findOne({ token: req.params.token })
//utiliser le user id pour chercher le document dans général
//afficher général

// Asynchrone function to upload file to cloudinary then retrieve URL
const cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send("upload image error");
      resolve({
        res: res.secure_url,
      });
    });
  });
};

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

const cpUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "bannerPicture", maxCount: 1 },
]);
router.post("/update/:token", cpUpload, async function (req, res, next) {
  const sentData = JSON.parse(req.body.data);

  const generalUpdate = {
    firstname: sentData.firstname,
    lastname: sentData.lastname,
    birthday: new Date(sentData.birthday),
    address: sentData.address,
    description: sentData.description,
    headline: sentData.headline,
    experience: sentData.experience,
    hasAcceptedToBeShown: sentData.hasAcceptedToBeShown,
    currentJob: sentData.currentJob,
    // urlLinkedIn: sentData.urlLinkedIn,
  };

  // Upload, add in update object then delete temp file pic
  if (req.files.bannerPicture !== undefined) {
    const bannerPath = await cloudinaryImageUploadMethod(
      req.files.bannerPicture[0].path
    );
    generalUpdate.bannerPicture = bannerPath.res;
    fs.unlinkSync(req.files.bannerPicture[0].path);
  }

  // Upload, add in update object then delete temp file pic
  if (req.files.profilePicture !== undefined) {
    const profilePath = await cloudinaryImageUploadMethod(
      req.files.profilePicture[0].path
    );
    generalUpdate.profilePicture = profilePath.res;
    fs.unlinkSync(req.files.profilePicture[0].path);
  }

  //permet de créer/éditer les infos generales de l'utilisateur
  //On cherche d'abord le user avec son token pour récuperer son id
  //puis on modifie via updateOne le document General associé au user id
  User.findOne({ token: req.params.token }).then((data) => {
    if (data !== null) {
      General.updateOne({ user: data._id }, generalUpdate).then(() =>
        res.json({
          result: true,
          res: "Votre profil a été mis à jour !",
        })
      );
    }
  });
});

//permet de créer les infos generales de l'utilisateur consernant son job actuel et son experience

router.post("/setup/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    console.log(data);
    if (data !== null) {
      General.updateOne(
        { user: data._id },
        { currentJob: req.body.currentJob, experience: req.body.experience }
      ).then((data) =>
        res.json({
          result: data,
          res: "Votre profil a été mis à jour !",
        })
      );
    } else {
      res.json({
        result: false,
        res: "Une erreur est survenue",
      });
    }
  });
});

module.exports = router;
