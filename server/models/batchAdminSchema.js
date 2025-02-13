const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const BatchAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  adminType: {
    type: String,
    enum: ["superadmin", "batchadmin", "classadmin"],
    required: true,
  },
  batch:{type: String, required: true, unique:true},
  password: { type: String, required: true },
});

// Hash password before saving
BatchAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("batchadmins", BatchAdminSchema);
