import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import Footer from '/src/components/Footer.jsx';
import '/src/styles/AdminPage.css';

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState('students');

  return (
    <>
      <Header />
      <div className="admin-container">
        <nav className="admin-sidebar">
          <ul>
            <li onClick={() => setSelectedTab('students')} className={selectedTab === 'students' ? 'active' : ''}>Students</li>
            <li onClick={() => setSelectedTab('courses')} className={selectedTab === 'courses' ? 'active' : ''}>Courses</li>
            <li onClick={() => setSelectedTab('enrollments')} className={selectedTab === 'enrollments' ? 'active' : ''}>Enrollments</li>
          </ul>
        </nav>

        <main className="admin-content">
          {selectedTab === 'students' && <p>Manage Students</p>}
          {selectedTab === 'courses' && <p>Manage Courses</p>}
          {selectedTab === 'enrollments' && <p>Manage Enrollments</p>}
        </main>
      </div>
      <Footer />
    </>
  );
}
