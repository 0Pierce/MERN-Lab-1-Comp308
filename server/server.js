const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("./config/mongoDB"); 
const authRoutes = require("./routes/authRoutes"); 
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes"); 
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/course", courseRoutes); 
app.use("/admin", adminRoutes); 

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
