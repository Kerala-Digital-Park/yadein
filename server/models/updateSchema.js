const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UpdateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "batches", required: true },
  classForm: { type: mongoose.Schema.Types.ObjectId, ref: "classes", required: true },
  password: { type: String },
  email: { type: String },
  contact: { type: Number, default: null },
  whatsapp: { type: Number, default: null },
  facebook: { type: String },
  instagram: { type: String },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  occupation: { type: String, default: null },
  profileImage: { type: String },
  maskNumber: { type: Boolean, default: false }, 
});

// UpdateSchema.pre("save", async function (next) {
//   if (this.password && this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

module.exports = mongoose.model("updates", UpdateSchema);
