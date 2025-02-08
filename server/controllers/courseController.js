const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course"); 


exports.getCourses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No user data in request" });
        }

        
        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        
        const courses = await Course.find({ courseCode: { $in: student.courses } });

        console.log("Full course details being sent:", courses);
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.addCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;

        if (!courseCode || !courseName || !section || !semester) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!req.user) {
            return res.status(401).json({ error: "No user data in request" });
        }

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

       
        if (student.courses.includes(courseCode)) {
            return res.status(400).json({ error: "Course already existsss" });
        }

       
        let existingCourse = await Course.findOne({ courseCode });

        if (!existingCourse) {
           
            existingCourse = new Course({ courseCode, courseName, section, semester });
            await existingCourse.save();
        }

       
        student.courses.push(courseCode);
        await student.save();

        res.json({ message: "Course added", course: existingCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.updateCourse = async (req, res) => {
    try {
        const { courseCode, section } = req.body;

        if (!courseCode || !section) {
            return res.status(400).json({ error: "courseCode and section eeeeeee" });
        }

        
        const updatedCourse = await Course.findOneAndUpdate(
            { courseCode },
            { section },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json({ message: "Course updated", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.dropCourse = async (req, res) => {
    try {
        const { courseCode } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "No user data in request" });
        }

        const student = await User.findById(req.user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        if (!student.courses.includes(courseCode)) {
            return res.status(400).json({ error: "Course not found in student record" });
        }

      
        student.courses = student.courses.filter(code => code !== courseCode);
        await student.save();

        res.json({ message: "Course dropped" });
    } catch (error) {
        console.error("Error dropping course:", error);
        res.status(500).json({ error: "Server error" });
    }
};
