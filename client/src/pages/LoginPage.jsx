import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "/src/components/Header.jsx";
import Footer from "/src/components/Footer.jsx";
import "/src/styles/LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("Login Response:", res.data);

     
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Invalid username or password");
    }
  };

  return (
    <>
      <Header />
      <div className="LoginPage">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <Footer />
    </>
  );
}