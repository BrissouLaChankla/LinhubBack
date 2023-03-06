const mongoose = require("mongoose");

const experienceSchema = mongoose.Schema({
  company: String,
  description: String,
  location: String,
  locationString: String,
  title: String,
  startMonthYear: Date,
  EndMonthYear: Date,
  typeOfContract: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Experience = mongoose.model("experiences", positionSchema);

module.exports = Experience;