const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const PORT = 8080 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const BOT_NAME = "Chatty Bot";

// Run when client connects
io.on("connection", (socket) => {
  /**
   * We have three different type of emit
   *
   * 1. io.emit() -> ping every client
   * 2. socket.emit() -> ping the connecting client
   * 3. socket.broadcast.emit() -> ping everyone except the connecting client
   *
   * Note: To be ping in a specific room -> use .to(roomName).emit()
   */

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(BOT_NAME, "Welcome to Chatty"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(BOT_NAME, `${user.username} has joined the chat`)
      );

    // Send user & room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // Runs when a user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT_NAME, `${user.username} has left the chat`)
      );

      // Send user & room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
