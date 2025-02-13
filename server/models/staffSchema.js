const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffType: {
    type: String,
    enum: ["principal", "teacher", "non-teaching"],
    required: true,
  },
  profileImage: { type: String },
});

module.exports = mongoose.model("staffs", StaffSchema);
