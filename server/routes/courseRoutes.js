const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticateUser } = require("../middleware/authMiddleware"); // ✅ Use function

// ✅ Secure routes using authentication middleware
router.get("/courses", authenticateUser, courseController.getCourses);
router.post("/add-course", authenticateUser, courseController.addCourse);
router.put("/update-course", authenticateUser, courseController.updateCourse);
router.delete("/drop-course", authenticateUser, courseController.dropCourse);

module.exports = router;
