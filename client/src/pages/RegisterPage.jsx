import { useState } from "react";
import "/src/styles/RegisterPage.css";
import Header from "/src/components/Header.jsx";
import Footer from "/src/components/Footer.jsx";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [program, setProgram] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const generateStudentNumber = () => {
    return "S" + Math.floor(100000 + Math.random() * 900000); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      userType,
    };

    if (userType === "Student") {
      userData.studentNumber = generateStudentNumber();
      userData.firstName = firstName;
      userData.lastName = lastName;
      userData.address = address;
      userData.city = city;
      userData.phoneNumber = phoneNumber;
      userData.program = program;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! Please log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        setUserType("Student");
        setFirstName("");
        setLastName("");
        setAddress("");
        setCity("");
        setPhoneNumber("");
        setProgram("");
      } else {
        setErrorMessage(data.error || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("Server error");
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
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label>User Type:</label>
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {userType === "Student" && (
            <>
              <div>
                <label>First Name:</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label>Last Name:</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <label>Address:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div>
                <label>City:</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <label>Phone Number:</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <div>
                <label>Program:</label>
                <input type="text" value={program} onChange={(e) => setProgram(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit">Register</button>
        </form>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
      <Footer />
    </>
  );
}
