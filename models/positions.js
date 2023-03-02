const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
  company: String,
  description: String,
  location: String,
  locationString: String,
  title: String,
  startMonthYear: Date,
  EndMonthYear: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Position = mongoose.model("positions", positionSchema);

module.exports = Position;
