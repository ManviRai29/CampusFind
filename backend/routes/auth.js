const express = require("express");
const router = express.Router();

// Dummy hardcoded credentials for this demo project.
// No real authentication / hashing is used on purpose to keep the
// project small, as this is a portfolio / college project.
const VALID_USERNAME = "student";
const VALID_PASSWORD = "1234";

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    return res.json({
      success: true,
      message: "Login successful.",
      // Simple demo token - NOT secure, just enough to simulate a session.
      token: "campusfind-demo-token",
      username,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password.",
  });
});

module.exports = router;
