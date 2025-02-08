const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.cookies.session || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key"); 
    req.user = decoded; 

   
    req.user.isAdmin = req.user.userType === "Admin";

    console.log("Auth User:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
