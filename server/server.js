//dns for mongodb ( don't remove it anyhow)
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
