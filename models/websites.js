const mongoose = require("mongoose");

const websiteSchema = mongoose.Schema({
  category: String,
  label: String,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Website = mongoose.model("websites", websiteSchema);

module.exports = Website;
