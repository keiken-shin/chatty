const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const PORT = 8080 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  /**
   * We have three different type of emit
   *
   * 1. io.emit() -> ping every client
   * 2. socket.emit() -> ping the connecting client
   * 3. socket.broadcast.emit() -> ping everyone except the connecting client
   */

  // Welcome current user
  socket.emit("message", "Welcome to Chatty");

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // Runs when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // Listen for chat message
  socket.on("chatMessage", (message) => {
    io.emit("message", message);
  });
});

server.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
