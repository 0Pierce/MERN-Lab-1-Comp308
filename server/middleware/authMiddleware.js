const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.cookies.session || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key"); // 🔹 Keep your existing logic
    req.user = decoded; // Attach user info to request

    // ✅ Check if user is an Admin and set flag (won't break student users)
    req.user.isAdmin = req.user.userType === "Admin";

    console.log("Authenticated User:", req.user); // Debugging
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
