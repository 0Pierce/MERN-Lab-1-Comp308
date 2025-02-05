const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    if (!username || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, userType });

    res.status(201).json({ message: "User registered successfully. Please log in to continue." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType, username: user.username },
      "your_secret_key",
      { expiresIn: "3h" }
    );

    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("session", { httpOnly: true, secure: false, sameSite: "Lax" });
  res.json({ message: "Logout successful" });
};

// Check Session
exports.checkSession = (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ message: "No active session" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    res.json({ message: "User is logged in", token });
  } catch {
    res.status(401).json({ message: "Invalid session" });
  }
};
