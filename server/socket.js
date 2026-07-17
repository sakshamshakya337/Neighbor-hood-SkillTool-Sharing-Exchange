const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://neighbor-hood-skill-tool-sharing-ex.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ].filter(Boolean);

  io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) {
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Socket CORS not allowed for origin: ${origin}`));
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io:", socket.id);

    // User connects with their user ID
    socket.on("setup", (userData) => {
      if (userData && userData._id) {
        socket.join(userData._id);
        console.log(`User ${userData._id} connected to personal room`);
        socket.emit("connected");
      }
    });

    // Join a specific chat room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // Handle incoming new message
    socket.on("new message", (newMessageReceived) => {
      const chat = newMessageReceived.chatId;

      if (!chat || !chat.participants) {
        return console.log("chat.participants not defined");
      }

      chat.participants.forEach((user) => {
        const participantId = user._id?.toString?.() || user.toString();
        const senderId = newMessageReceived.senderId?._id?.toString?.() || newMessageReceived.senderId?.toString?.();

        // Don't send the message back to the sender
        if (participantId === senderId) return;

        // Emit to the specific user's personal room
        socket.in(participantId).emit("message received", newMessageReceived);
      });
    });

    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED", socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIo };
