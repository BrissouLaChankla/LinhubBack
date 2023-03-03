const mongoose = require("mongoose");

const languageSchema = mongoose.Schema({
  name: String,
  proficiency: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Language = mongoose.model("languages", languageSchema);

module.exports = Language;
