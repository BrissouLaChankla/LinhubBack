const mongoose = require("mongoose");

const educationSchema = mongoose.Schema({
  schoolName: String,
  degreeName: String,
  fieldOfStudyName: String,
  startDate: Date,
  endDate: Date,
  activitiesAndAssociations: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Education = mongoose.model("education", educationSchema);
module.exports = Education;
