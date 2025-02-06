const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["Student", "Admin"], required: true },

  // Student-specific fields
  studentNumber: { type: String, unique: true, sparse: true },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
  phoneNumber: { type: String },
  program: { type: String },
  favoriteProfessor: { type: String },
  gradeAverage: { type: Number, min: 0, max: 100 }, 

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("User", UserSchema, "users");
