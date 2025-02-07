const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course"); // ✅ Correct model import

// ✅ Fetch all courses from the `Course` table
exports.getCourses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
        }

        // Find the student and retrieve their course codes
        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // ✅ Fetch full course details using courseCode from the `Course` table
        const courses = await Course.find({ courseCode: { $in: student.courses } });

        console.log("Full course details being sent:", courses);
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Add a new course and link it to the student
exports.addCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;

        if (!courseCode || !courseName || !section || !semester) {
            return res.status(400).json({ error: "All fields (courseCode, courseName, section, semester) are required" });
        }

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
        }

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // ✅ Prevent duplicate course entries
        if (student.courses.includes(courseCode)) {
            return res.status(400).json({ error: "Course already added" });
        }

        // ✅ Check if the course already exists in the database
        let existingCourse = await Course.findOne({ courseCode });

        if (!existingCourse) {
            // ✅ Save course if it doesn’t exist
            existingCourse = new Course({ courseCode, courseName, section, semester });
            await existingCourse.save();
        }

        // ✅ Store `courseCode` instead of `_id`
        student.courses.push(courseCode);
        await student.save();

        res.json({ message: "Course added successfully", course: existingCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Update a course using `courseCode`
exports.updateCourse = async (req, res) => {
    try {
        const { courseCode, section } = req.body;

        if (!courseCode || !section) {
            return res.status(400).json({ error: "Both courseCode and section are required" });
        }

        // ✅ Find the course by courseCode and update
        const updatedCourse = await Course.findOneAndUpdate(
            { courseCode },
            { section },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found with the given courseCode" });
        }

        res.json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Drop a course using `courseCode`
exports.dropCourse = async (req, res) => {
    try {
        const { courseCode } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
        }

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        if (!student.courses.includes(courseCode)) {
            return res.status(400).json({ error: "Course not found in student record" });
        }

        // ✅ Remove courseCode from student's courses list
        student.courses = student.courses.filter(code => code !== courseCode);
        await student.save();

        res.json({ message: "Course dropped successfully" });
    } catch (error) {
        console.error("Error dropping course:", error);
        res.status(500).json({ error: "Server error" });
    }
};
