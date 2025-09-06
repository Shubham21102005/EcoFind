const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./utils/connectDB.js");
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // allow frontend origin
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chats", chatRoutes);

// --------------------
// Socket.IO logic
// --------------------
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Join a chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat ${chatId}`);
  });

  // Send a message
  socket.on("sendMessage", async ({ chatId, senderId, text }) => {
    const Chat = require("./models/chatModel.js");
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    const message = { sender: senderId, text, timestamp: new Date() };
    chat.messages.push(message);
    await chat.save();

    // Emit to all users in the room
    io.to(chatId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 8080;
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

startServer();
