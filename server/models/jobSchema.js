const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  job: { type: String, required: true },
});


module.exports = mongoose.model("jobs", JobSchema);
