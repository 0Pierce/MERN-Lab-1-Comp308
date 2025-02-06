const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authenticateUser } = require("../middleware/authMiddleware");


router.get("/profile", authenticateUser, studentController.getStudentProfile);
router.put("/profile", authenticateUser, studentController.updateStudentProfile);
router.post("/addCourse", authenticateUser, studentController.addCourse);
router.put("/updateCourse", authenticateUser, studentController.updateCourse);
router.delete("/dropCourse", authenticateUser, studentController.dropCourse);
router.get("/courses", authenticateUser, studentController.getCourses);

module.exports = router;
