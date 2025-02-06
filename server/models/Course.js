const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true }, // Added semester field
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Reference to students
});

module.exports = mongoose.model("Course", CourseSchema);
