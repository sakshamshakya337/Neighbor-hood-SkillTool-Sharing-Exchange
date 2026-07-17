const mongoose = require("mongoose");

// Cache the connection for serverless environments (Vercel)
// This prevents reconnecting on every request
let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async (retries = 3) => {
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
    
    const connectWithRetry = async (attemptsLeft) => {
      try {
        const m = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      } catch (err) {
        if (attemptsLeft === 1) throw err;
        console.log(`MongoDB connection failed. Retrying... (${attemptsLeft - 1} attempts left)`);
        await new Promise(res => setTimeout(res, 1000));
        return connectWithRetry(attemptsLeft - 1);
      }
    };

    cached.promise = connectWithRetry(retries);
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
