const User = require("../models/User");
const Course = require("../models/Course");


exports.getCourses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
        }

        const student = await User.findById(req.user.id).populate("courses");
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student.courses);
    } catch (error) {
        console.error("Error getting courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.addCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
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


exports.updateCourse = async (req, res) => {
    try {
        const { courseId, section } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { section }, { new: true });
        if (!updatedCourse) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.dropCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user data in request" });
        }

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        
        student.courses = student.courses.filter(course => course.toString() !== courseId);
        await student.save();

        res.json({ message: "Course dropped successfully" });
    } catch (error) {
        console.error("Error dropping course:", error);
        res.status(500).json({ error: "Server error" });
    }
}
