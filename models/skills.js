const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Skill = mongoose.model("skills", skillSchema);

module.exports = Skill;
