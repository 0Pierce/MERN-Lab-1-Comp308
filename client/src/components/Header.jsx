import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import "/src/styles/Header.css";

export default function Header() {
  const [userType, setUserType] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/check_session", { withCredentials: true });
        console.log("Session Response:", res.data); 

        let decodedToken;
        try {
          decodedToken = jwtDecode(res.data.token); 
          console.log("Decoded Token:", decodedToken); 
        } catch (error) {
          console.error("JWT Decode Error:", error);
          return;
        }

        if (decodedToken) {
          setUserType(decodedToken.userType);
          setUsername(decodedToken.username || "User");
        } else {
          console.log("No active session or invalid token.");
        }
      } catch (error) {
        console.log("No active session or invalid token.");
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="headerBody">
      
      <ul>
        <li><Link to="/">Home</Link></li>
        {!username ? (
          <>
            <li><Link to="/Login">Login</Link></li>
            <li><Link to="/Register">Register</Link></li>
          </>
        ) : (
          <>
            <li className="welcomeTxt"> {username}</li>
            {userType === "Admin" && <li><Link to="/Admin">Admin</Link></li>}
            {userType === "Student" && <li><Link to="/Student">Student</Link></li>}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </div>
  );
}