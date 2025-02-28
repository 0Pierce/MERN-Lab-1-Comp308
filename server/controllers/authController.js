const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateStudentNumber = () => {
  return "S" + Math.floor(100000 + Math.random() * 900000);
};

//Register 
exports.register = async (req, res) => {
  try {
    const { username, email, password, userType, firstName, lastName, address, city, phoneNumber, program } = req.body;

    if (!username || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      username,
      email,
      password: hashedPassword,
      userType,
    };

    //Add fields if user is student
    if (userType === "Student") {
      newUserData.studentNumber = generateStudentNumber();
      newUserData.firstName = firstName;
      newUserData.lastName = lastName;
      newUserData.address = address;
      newUserData.city = city;
      newUserData.phoneNumber = phoneNumber;
      newUserData.program = program;
    }

    //Save to db
    const newUser = await User.create(newUserData);

    res.status(201).json({ message: "User registered successfully. Please log in to continue." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


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


exports.logout = (req, res) => {
  res.clearCookie("session", { httpOnly: true, secure: false, sameSite: "Lax" });
  res.json({ message: "Logout successful" });
};


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
