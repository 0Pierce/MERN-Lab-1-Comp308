import { useState, useEffect } from "react";
import axios from "axios";
import Header from "/src/components/Header.jsx";
import Footer from "/src/components/Footer.jsx";

import "/src/styles/AdminPage.css";

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    program: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // ✅ Fetch all students (Admin Only)
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/students/all", { withCredentials: true });

      if (response.data.students && Array.isArray(response.data.students)) {
        setStudents(response.data.students);
      } else {
        console.error("❌ Unexpected response format:", response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error.response?.data?.message || error.message);
      setStudents([]);
    }
  };

  // ✅ Fetch all courses (Admin Only)
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/courses/all", { withCredentials: true });

      if (response.data.courses && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else {
        console.error("❌ Unexpected response format:", response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error.response?.data?.message || error.message);
      setCourses([]);
    }
  };

  // ✅ Fetch students for a specific course (Admin Only)
  const fetchCourseStudents = async (courseCode) => {
    if (!courseCode) return;
    try {
      const response = await axios.get(`http://localhost:5000/admin/courses/${courseCode}/students`, { withCredentials: true });

      if (response.data.students && Array.isArray(response.data.students)) {
        setCourseStudents(response.data.students);
      } else {
        console.error("❌ Unexpected response format:", response.data);
        setCourseStudents([]);
      }
    } catch (error) {
      console.error("❌ Error fetching course students:", error.response?.data?.message || error.message);
      setCourseStudents([]);
    }
  };

  // ✅ Generate a unique student number
  const generateStudentNumber = () => `S${Date.now()}`;

  // ✅ Add a new student (Admin Only)
  const handleAddStudent = async () => {
    const { username, email, firstName, lastName, address, city, phoneNumber, program } = newStudent;
    if (!username || !email || !firstName || !lastName || !address || !city || !phoneNumber || !program) {
      alert("⚠ Please fill in all fields.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/admin/students/add",
        {
          username,
          email: email.trim().toLowerCase(),
          password: "TempPass123!",
          userType: "Student",
          studentNumber: generateStudentNumber(),
          firstName,
          lastName,
          address,
          city,
          phoneNumber,
          program,
        },
        { withCredentials: true }
      );

      alert("✅ Student added successfully!");
      setNewStudent({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phoneNumber: "",
        program: "",
      });
      fetchStudents(); // Refresh student list
    } catch (error) {
      alert(error.response?.data?.message || "❌ Error adding student.");
    }
  };

  return (
    <>
      <Header />
      <div className="admin-container">
        <nav className="admin-sidebar">
          <ul>
            <li onClick={() => setSelectedTab("students")} className={selectedTab === "students" ? "active" : ""}>
              Students
            </li>
            <li onClick={() => setSelectedTab("courses")} className={selectedTab === "courses" ? "active" : ""}>
              Courses
            </li>
            <li onClick={() => setSelectedTab("enrollments")} className={selectedTab === "enrollments" ? "active" : ""}>
              Enrollments
            </li>
          </ul>
        </nav>

        <main className="admin-content">
          {selectedTab === "students" && (
            <>
              <h2>Manage Students</h2>
              <div className="add-student-form">
                <input type="text" placeholder="Username" value={newStudent.username} onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })} />
                <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
                <input type="text" placeholder="First Name" value={newStudent.firstName} onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })} />
                <input type="text" placeholder="Last Name" value={newStudent.lastName} onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })} />
                <input type="text" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} />
                <input type="text" placeholder="City" value={newStudent.city} onChange={(e) => setNewStudent({ ...newStudent, city: e.target.value })} />
                <input type="text" placeholder="Phone Number" value={newStudent.phoneNumber} onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })} />
                <input type="text" placeholder="Program" value={newStudent.program} onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })} />
                <button onClick={handleAddStudent}>Add Student</button>
              </div>
              <h3>All Students</h3>
              <ul>
                {students.map((student) => (
                  <li key={student._id}>
                    {student.studentNumber} - {student.firstName} {student.lastName} ({student.email})
                  </li>
                ))}
              </ul>
            </>
          )}

          {selectedTab === "courses" && (
            <>
              <h2>Manage Courses</h2>
              <h3>All Courses</h3>
              <ul>
                {courses.map((course) => (
                  <li key={course._id}>
                    {course.courseCode} - {course.courseName} (Section {course.section})
                  </li>
                ))}
              </ul>
            </>
          )}

          {selectedTab === "enrollments" && (
            <>
              <h2>Manage Enrollments</h2>
              <select
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  fetchCourseStudents(e.target.value);
                }}
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
              <h3>Students in Selected Course</h3>
              <ul>
                {courseStudents.map((student) => (
                  <li key={student._id}>
                    {student.firstName} {student.lastName} - {student.email}
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
