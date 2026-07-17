// Default DNS resolution is used to avoid SRV lookup failures on certain networks

const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5001;

// Only start listening when running directly (local dev)
// Vercel serverless will import this module and use the exported app
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  initSocket(server);

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

// Export for Vercel serverless
module.exports = app;
