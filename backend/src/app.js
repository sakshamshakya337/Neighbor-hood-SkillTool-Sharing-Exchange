require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS config
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.send("Neighborhood Skill/Tool Sharing API is running...");
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
