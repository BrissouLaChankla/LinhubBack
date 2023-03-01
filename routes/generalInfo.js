var express = require("express");
var router = express.Router();
const General = require("../models/generals");
const User = require("../models/users");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//chercher grâce au params(token) le user avec un User.findOne({ token: req.params.token })
//utiliser le user id pour chercher le document dans général
//afficher général


// Asynchrone function to upload file to cloudinary then retrieve URL
const cloudinaryImageUploadMethod = async file => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send("upload image error")
      resolve({
        res: res.secure_url
      })
    }
    )
  })
}

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

router.post("/update/:token", upload.array('profileBannerPictures', 2), async (req, res) => {
  
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await cloudinaryImageUploadMethod(path);
    urls.push(newPath);
  }
  
  let productImages = urls.map( url => url.res );
  const sentData = JSON.parse(req.body.data)
  
  //permet de créer/éditer les infos generales de l'utilisateur
  //On cherche d'abord le user avec son token pour récuperer son id
  //puis on modifie via updateOne le document General associé au user id
  User.findOne({ token: req.params.token }).then((data) => {
    
    if (data !== null) {
      General.updateOne(
        { user: data._id },
        {
          general: {
            firstname:sentData.firstname,
            lastname:sentData.lastname,
            birthday: sentData.birthday,
            address: sentData.address,
            description: sentData.description,
            headline: sentData.headline,
            yearExperience: sentData.yearExperience,
            // currentJob: sentData.currentJob,
            profilePicture: productImages[0],
            backgroundPicture: productImages[1],
            // urlLinkedIn: sentData.urlLinkedIn,
          },
        }
      ).then(() =>
        res.json({
          result: true,
          res: "Votre profil a été mis à jour !",
        })
      );
    }
  });
});

module.exports = router;
