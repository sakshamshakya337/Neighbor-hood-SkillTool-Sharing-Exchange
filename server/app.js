require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const toolRoutes = require("./routes/toolRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const skillRoutes = require("./routes/skillRoutes");

// New Routes
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================
// CORS
// =====================
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://neighbor-hood-skill-tool-sharing-ex.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5001",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      process.env.NODE_ENV !== "production" &&
      origin.startsWith("http://localhost")
    ) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// =====================
// Database Connection
// =====================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      message: "Service temporarily unavailable.",
    });
  }
});

// =====================
// API Routes
// =====================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api", toolRoutes);
app.use("/api", bookingRoutes);
app.use("/api", skillRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reportRoutes);

// =====================
// Health Check
// =====================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// =====================
// Production
// =====================
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");

  app.use(express.static(distPath));

  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Neighborhood Skill/Tool Sharing API is running...");
  });
}

// =====================
// Error Handlers
// =====================
app.use(notFound);
app.use(errorHandler);

module.exports = app;