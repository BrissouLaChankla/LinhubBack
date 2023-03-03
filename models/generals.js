const mongoose = require("mongoose");

const generalSchema = mongoose.Schema({
  birthday: Date,
  firstname:String,
  lastname:String,
  address: String,
  description: String,
  headline: String,
  experience: Number,
  currentJob: String,
  profilePicture:String,
  bannerPicture:String,
  hasAcceptedToBeShown:Boolean,
  urlLinkedIn: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const General = mongoose.model("generals", generalSchema);

module.exports = General;
