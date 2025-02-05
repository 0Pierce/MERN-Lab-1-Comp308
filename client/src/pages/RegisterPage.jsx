import { useState } from 'react';
import '/src/styles/RegisterPage.css';
import Header from '/src/components/Header.jsx';
import Footer from '/src/components/Footer.jsx';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Student');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      userType
    };

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Please log in to continue.');
        setUsername('');
        setEmail('');
        setPassword('');
        setUserType('Student');
      } else {
        setErrorMessage(data.error || 'An error occurred');
      }
    
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <h2>REGISTER PAGE</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>User Type:</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
      <Footer />
    </>
  );
}
