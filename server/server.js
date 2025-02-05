const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(
  "mongodb+srv://0Pierce:Pierce0303@atlascluster.7nsnxtt.mongodb.net/MERN_COMP307?retryWrites=true&w=majority&appName=AtlasCluster"
)
.then(() => {
  console.log("MongoDB connected successfully to MERN_COMP307!");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["Student", "Admin"], required: true },
});

const User = mongoose.model("User", UserSchema, "users");

// Authentication Routes
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
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
});

authRouter.post("/login", async (req, res) => {
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
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("session", { httpOnly: true, secure: false, sameSite: "Lax" });
  res.json({ message: "Logout successful" });
});

authRouter.get("/check_session", (req, res) => {
    const token = req.cookies.session;
    if (!token) return res.status(401).json({ message: "No active session" });
  
    try {
      const decoded = jwt.verify(token, "your_secret_key");
      res.json({ message: "User is logged in", token });
    } catch {
      res.status(401).json({ message: "Invalid session" });
    }
  });

app.use("/auth", authRouter);
app.listen(5000, () => console.log("Server running on port 5000"));
