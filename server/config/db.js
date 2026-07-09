const mongoose = require("mongoose");

// Cache the connection for serverless environments (Vercel)
// This prevents reconnecting on every request
let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return cached connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  // Reuse in-progress connection promise
  if (!cached.promise) {
    console.log("Mongoose attempting to connect to database...");
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10s timeout
        socketTimeoutMS: 45000,
      })
      .then((m) => {
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset on failure so next request retries
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
