require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS config — allow any localhost port in dev, CLIENT_URL in production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://neighbor-hood-skill-tool-sharing-ex.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean); // remove undefined/null

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server, same-origin)
    if (!origin) return callback(null, true);
    // In development, allow any localhost origin
    if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) {
      return callback(null, true);
    }
    // In production, only allow explicitly listed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// DB connection middleware — connects on first request, reuses cached connection after
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({
      message: "Service temporarily unavailable. Please try again in a moment.",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const toolRoutes = require("./routes/toolRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const skillRoutes = require("./routes/skillRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const trustScoreRoutes = require("./routes/trustScoreRoutes");

app.use("/api", toolRoutes);
app.use("/api", bookingRoutes);
app.use("/api", skillRoutes);
app.use("/api", trustScoreRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend in production (Vercel handles static files via vercel.json, this is a fallback)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  // NOTE: Only catch non-API routes for SPA fallback
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Neighborhood Skill/Tool Sharing API is running...");
  });
}

// Error handling middlewares (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
