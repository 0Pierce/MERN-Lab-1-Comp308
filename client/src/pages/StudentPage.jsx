import Header from '/src/components/Header.jsx';
import Footer from '/src/components/Footer.jsx';
import { useEffect, useState } from 'react';
import '/src/styles/StudentPage.css';

export default function StudentPage() {
    const [student, setStudent] = useState({});
    const [formData, setFormData] = useState({});
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseCode: '', courseName: '', section: '', semester: '' });
    const [updateCourseData, setUpdateCourseData] = useState({ courseCode: '', section: '' });

    useEffect(() => {
        fetchStudentProfile();
        fetchCourses();
    }, []);

  
    const fetchStudentProfile = () => {
        fetch('http://localhost:5000/student/profile', {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then((data) => {
            console.log("Fetched student data:", data);
            setStudent(data);
            setFormData(data);
        })
        .catch((error) => console.error('Error fetching student profile:', error));
    };

   
    const fetchCourses = () => {
        fetch('http://localhost:5000/course/courses', {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then((data) => {
            console.log("Fetched full course data:", data);
            if (Array.isArray(data) && data.length > 0) {
                setCourses(data);
            } else {
                console.error("missing or malformed:", data);
                setCourses([]);
            }
        })
        .catch((error) => console.error('Error fetching courses:', error));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        const response = await fetch('http://localhost:5000/student/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedData = await response.json();
            setStudent(updatedData);
            alert('Profile updated');
        } else {
            alert('Failed to update profile');
        }
    };


    const handleAddCourse = async () => {
        if (courses.some(course => course.courseCode === newCourse.courseCode)) {
            alert('You have already added this course!');
            return;
        }

        const response = await fetch('http://localhost:5000/course/add-course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newCourse),
        });

        if (response.ok) {
            alert('Course added');
            setNewCourse({ courseCode: '', courseName: '', section: '', semester: '' });
            fetchCourses();
        } else {
            alert('Failed to add course');
        }
    };

    const handleUpdateCourse = async () => {
        const response = await fetch('http://localhost:5000/course/update-course', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updateCourseData),
        });

        if (response.ok) {
            alert('Course updated successfully!');
            setUpdateCourseData({ courseCode: '', section: '' });
            fetchCourses();
        } else {
            alert('Failed to update course');
        }
    };

    const handleDropCourse = async (courseCode) => {
        const response = await fetch('http://localhost:5000/course/drop-course', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ courseCode }),
        });

        if (response.ok) {
            alert('Course dropped');
            fetchCourses();
        } else {
            alert('Failed to drop course');
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <div className="profile-section">
                    <h2>Edit Profile</h2>
                    <form>
                        <label>Username:</label>
                        <input name="username" value={formData?.username || ''} onChange={handleChange} readOnly />

                        <label>Email:</label>
                        <input name="email" type="email" value={formData?.email || ''} onChange={handleChange} readOnly />

                        <label>Student Number:</label>
                        <input name="studentNumber" value={formData?.studentNumber || ''} onChange={handleChange} />

                        <label>First Name:</label>
                        <input name="firstName" value={formData?.firstName || ''} onChange={handleChange} />

                        <label>Last Name:</label>
                        <input name="lastName" value={formData?.lastName || ''} onChange={handleChange} />

                        <label>Address:</label>
                        <input name="address" value={formData?.address || ''} onChange={handleChange} />

                        <label>City:</label>
                        <input name="city" value={formData?.city || ''} onChange={handleChange} />

                        <label>Phone Number:</label>
                        <input name="phoneNumber" value={formData?.phoneNumber || ''} onChange={handleChange} />

                        <label>Program:</label>
                        <input name="program" value={formData?.program || ''} onChange={handleChange} />

                        <label>Favorite Professor:</label>
                        <input name="favoriteProfessor" value={formData?.favoriteProfessor || ''} onChange={handleChange} />

                        <label>Grade Average:</label>
                        <input name="gradeAverage" type="number" min="0" max="100" value={formData?.gradeAverage || ''} onChange={handleChange} />

                        <button type="button" onClick={handleUpdateProfile}>Save</button>
                    </form>
                </div>

                <div className="course-section">
                    <h2>Manage Courses</h2>
                    <h4>Add Course</h4>
                    <input placeholder="Course Code" value={newCourse.courseCode} onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })} />
                    <input placeholder="Course Name" value={newCourse.courseName} onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })} />
                    <input placeholder="Section" value={newCourse.section} onChange={(e) => setNewCourse({ ...newCourse, section: e.target.value })} />
                    <input placeholder="Semester" value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} />
                    <button onClick={handleAddCourse}>Add Course</button>

                    <h4>Update Course Section</h4>
                    <input placeholder="Course Code" value={updateCourseData.courseCode} onChange={(e) => setUpdateCourseData({ ...updateCourseData, courseCode: e.target.value })} />
                    <input placeholder="New Section" value={updateCourseData.section} onChange={(e) => setUpdateCourseData({ ...updateCourseData, section: e.target.value })} />
                    <button onClick={handleUpdateCourse}>Update Course</button>

                    <h4>Courses Taken</h4>
                    
<ul>
    {courses.length > 0 ? (
        courses.map((course, index) => (
            <li key={course.courseCode || index}>
                {course.courseCode && course.courseName
                    ? `${course.courseCode} - ${course.courseName} - Section: ${course.section}`
                    : "Invalid Course Data"}
                <button onClick={() => handleDropCourse(course.courseCode)}>Drop</button>
            </li>
        ))
    ) : (
        <li>No courses found</li>
    )}
</ul>
                </div>
            </div>
            <Footer />
        </>
    );
}
