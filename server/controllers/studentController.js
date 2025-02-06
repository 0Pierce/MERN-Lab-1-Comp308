const User = require("../models/User");
const Course = require("../models/Course");

// Get student profile
exports.getStudentProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const student = await User.findById(req.user.id).select("-password"); // Hide password field
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student);
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const updatedStudent = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
        if (!updatedStudent) return res.status(404).json({ error: "Student not found" });

        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a course
exports.addCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const { courseCode, courseName, section } = req.body;
        if (!courseCode || !courseName || !section) {
            return res.status(400).json({ error: "All course fields are required" });
        }

        const newCourse = new Course({ courseCode, courseName, section });
        await newCourse.save();

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        student.courses.push(newCourse._id);
        await student.save();

        res.json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const { courseId, section } = req.body;
        if (!courseId || !section) {
            return res.status(400).json({ error: "Course ID and section are required" });
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { section }, { new: true });
        if (!updatedCourse) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Drop a course
exports.dropCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ error: "Course ID is required" });

        await User.findByIdAndUpdate(req.user.id, { $pull: { courses: courseId } });
        await Course.findByIdAndDelete(courseId);

        res.json({ message: "Course dropped successfully" });
    } catch (error) {
        console.error("Error dropping course:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// List all courses
exports.getCourses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found in request" });
        }

        const student = await User.findById(req.user.id).populate("courses");
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student.courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};
