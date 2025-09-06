const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");

// ------------------------
// Create or Get Chat between two users
// ------------------------
exports.createOrGetChat = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    console.log("Logged-in user:", req.user.id);
    console.log("Target userId:", userId);
    console.log("ProductId:", productId);

    // Find existing chat between the two users for this product (or any product if not provided)
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, userId] },
      ...(productId ? { product: productId } : {}),
    })
      .populate("participants", "username profilePic")
      .populate("product", "title price");

    if (!chat) {
  chat = await Chat.create({
    participants: [req.user.id, userId],
    product: productId || null,
    messages: [],
  });

  // Populate separately using `findById`
  chat = await Chat.findById(chat._id)
    .populate("participants", "username profilePic")
    .populate("product", "title price");
}


    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Send Message
// ------------------------
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    if (!chatId || !text) return res.status(400).json({ message: "chatId and text are required" });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const message = {
      sender: req.user.id,
      text,
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    // Return the new message populated with sender info
    const populatedMessage = await Chat.populate(message, {
      path: "sender",
      select: "username profilePic"
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get all messages of a chat
// ------------------------
exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId)
      .populate("messages.sender", "username profilePic");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get all chats for the logged-in user
// ------------------------
exports.getUserChats = async (req, res) => {
  try {
    console.log("Fetching chats for user:", req.user.id);

    const chats = await Chat.find({ participants: { $in: [req.user.id] } })
      .populate("participants", "username profilePic")
      .populate("product", "title price")
      .sort({ updatedAt: -1 });

    // Optional: Add last message preview for UI
    const chatsWithLastMessage = chats.map(chat => ({
      ...chat.toObject(),
      lastMessage: chat.messages[chat.messages.length - 1] || null
    }));

    res.status(200).json(chatsWithLastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
