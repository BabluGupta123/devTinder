const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FrontendUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      if (!fromUserId || !toUserId) return;

      const roomId = [fromUserId, toUserId].sort().join("_");

      socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", ({ fromUserId, toUserId, text, firstname }) => {
      if (!fromUserId || !toUserId || !text) return;

      const roomId = [fromUserId, toUserId].sort().join("_");

      const message = {
        text,
        firstname,
        senderId: fromUserId,
        time: new Date().toLocaleTimeString(),
      };

      console.log("Broadcasting to room:", roomId);

      io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
