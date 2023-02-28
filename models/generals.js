const mongoose = require("mongoose");

const generalSchema = mongoose.Schema({
  general: {
    birthDate: Date,
    adress: String,
    description: String,
    headline: String,
    yearExperience: Date,
    currentJob: String,
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    backgroundPicture: {
      data: Buffer,
      contentType: String,
    },
    urlLinkedIn: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const General = mongoose.model("generals", generalSchema);

module.exports = General;
