const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");

exports.getAllStudentsAdmin = async (req, res) => {
    try {
        const students = await User.find({ userType: "Student" }).select("-password");
        res.json({ students, admin: true });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({ courses, admin: true });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getStudentsInCourseAdmin = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const students = await User.find({ courses: courseCode, userType: "Student" }).select("-password");
        res.json({ students, admin: true });
    } catch (error) {
        console.error("Error fetching students for course:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.addStudentAdmin = async (req, res) => {
    try {
        const {
            username, email, firstName, lastName, address, city,
            phoneNumber, program, favoriteProfessor, gradeAverage
        } = req.body;

        if (!username || !email || !firstName || !lastName || !address || !city || !phoneNumber || !program) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "Emailexists" });
        }

        const hashedPassword = await bcrypt.hash("TempPass", 12);

        const newStudent = new User({
            username,
            email: email.trim().toLowerCase(),
            password: hashedPassword, 
            userType: "Student", 
            studentNumber: `S${Date.now()}`,
            firstName,
            lastName,
            address,
            city,
            phoneNumber,
            program,
            favoriteProfessor: favoriteProfessor || "", 
            gradeAverage: gradeAverage || 0, 
            courses: [],
        });

        await newStudent.save();
        res.status(201).json({ message: "Student added", student: newStudent, admin: true });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Server error" });
    }
};
