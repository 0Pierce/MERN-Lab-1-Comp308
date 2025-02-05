const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("./config/mongoDB"); // Import DB connection
const authRoutes = require("./routes/authRoutes"); // Import routes

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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
