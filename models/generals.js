const mongoose = require("mongoose");

const generalSchema = mongoose.Schema({
  general: {
    birthday: Date,
    firstname:String,
    lastname:String,
    address: String,
    description: String,
    headline: String,
    yearExperience: Number,
    currentJob: String,
    profilePicture:String,
    backgroundPicture:String,
    urlLinkedIn: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const General = mongoose.model("generals", generalSchema);

module.exports = General;
