const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/students/all", authenticateUser, (req, res, next) => {
    if (!req.user || req.user.userType !== "Admin") return res.status(403).json({ error: "Admin access required" });
    adminController.getAllStudentsAdmin(req, res, next);
});

router.get("/courses/all", authenticateUser, (req, res, next) => {
    if (!req.user || req.user.userType !== "Admin") return res.status(403).json({ error: "Admin access required" });
    adminController.getAllCoursesAdmin(req, res, next);
});

router.get("/courses/:courseCode/students", authenticateUser, (req, res, next) => {
    if (!req.user || req.user.userType !== "Admin") return res.status(403).json({ error: "Admin access required" });
    adminController.getStudentsInCourseAdmin(req, res, next);
});

router.post("/students/add", authenticateUser, (req, res, next) => {
    if (!req.user || req.user.userType !== "Admin") return res.status(403).json({ error: "Admin access required" });
    adminController.addStudentAdmin(req, res, next);
});

module.exports = router;
