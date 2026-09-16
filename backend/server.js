const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CampusFind API is running." });
});

// Serve the frontend (static HTML/CSS/JS) from the sibling "frontend" folder
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// Fallback 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

app.listen(PORT, () => {
  console.log(`\n CampusFind server running at http://localhost:${PORT}`);
  console.log(` Login page:            http://localhost:${PORT}/index.html`);
  console.log(` Demo credentials ->    username: student | password: 1234\n`);
});
