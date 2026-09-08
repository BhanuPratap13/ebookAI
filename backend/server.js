require("dotenv").config({
  override: true,
});
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const aiRoutes = require("./routes/aiRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

// Connect Database
connectDB();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.some((o) => origin.startsWith(o)) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload & URL parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint for Render/uptime monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "eBookAI API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/export", exportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));