const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Project = mongoose.model("projects", projectSchema);

module.exports = Project;
