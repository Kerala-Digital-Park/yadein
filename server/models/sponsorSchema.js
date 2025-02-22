const mongoose = require("mongoose");

const SponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profileImage: { type: String },
});

module.exports = mongoose.model("sponsors", SponsorSchema);
