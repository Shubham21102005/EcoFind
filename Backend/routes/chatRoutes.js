const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  createOrGetChat,
  sendMessage,
  getMessages,
  getUserChats,
} = require("../controllers/chatControllers.js");

// ------------------------
// Create or get a chat between two users
// ------------------------
router.post("/", protect, createOrGetChat);

// ------------------------
// Send a message in a chat
// ------------------------
router.post("/message", protect, sendMessage);

// ------------------------
// Get all messages in a chat
// ------------------------
router.get("/:chatId/messages", protect, getMessages);

// ------------------------
// Get all chats of the logged-in user
// ------------------------
router.get("/", protect, getUserChats);

module.exports = router;
