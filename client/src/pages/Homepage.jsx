import '/src/styles/Homepage.css';
import Header from '/src/components/Header.jsx';
import Footer from '/src/components/Footer.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function Homepage() {
  const [studentName, setStudentName] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/check_session', { withCredentials: true });
        console.log('Session Response:', res.data); // Debugging

        let decodedToken;
        try {
          decodedToken = jwtDecode(res.data.token); // Directly use jwtDecode
          console.log('Decoded Token:', decodedToken); // Debugging
        } catch (error) {
          console.error('JWT Decode Error:', error);
          return;
        }

        if (decodedToken) {
          setStudentName(decodedToken.username || 'Unknown Student');
          setUserType(decodedToken.userType || 'N/A');
        } else {
          console.log('No active session or invalid token.');
        }
      } catch (error) {
        console.log('No active session or invalid token.');
      }
    };

    fetchStudentData();
  }, []);

  return (
    <>
      <Header />
      <div className="homepageBody">
        <div className="profileSection">
          <img src="/src/assets/mathHelp.jpg" alt="Profile" className="profileImage" />
          <h2>Welcome, {studentName}</h2>
          <p>User Type: {userType}</p>
        </div>

        <div className="announcementsSection">
          <h2>Announcements</h2>
          <ul className="announcementsList">
            <li>Announcement 1</li>
            <li>Announcement 2</li>
            <li>Announcement 3</li>
            {/* Add more announcements as needed */}
          </ul>
        </div>

        <div className="infoCardsSection">
          <h2>School Information</h2>
          <div className="infoCards">
            <div className="infoCard">
              <h3>Library Hours</h3>
              <p>Mon-Fri: 8am - 10pm</p>
              <p>Sat-Sun: 10am - 6pm</p>
            </div>
            <div className="infoCard">
              <h3>Upcoming Events</h3>
              <p>Science Fair: March 15</p>
              <p>Sports Day: April 20</p>
            </div>
            <div className="infoCard">
              <h3>Contact Information</h3>
              <p>Email: info@school.edu</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div className="infoCard">
              <h3>Campus Map</h3>
              <p>Find your way around the campus with our interactive map.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
