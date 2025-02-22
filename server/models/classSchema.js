const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref:'batches', required: true },
  classForm: { type: String, required: true},
  profileImage: { type: String },
});


module.exports = mongoose.model("classes", ClassSchema);
