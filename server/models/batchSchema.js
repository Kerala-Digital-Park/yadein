const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  year: { type: String, required: true },
});


module.exports = mongoose.model("batches", BatchSchema);
