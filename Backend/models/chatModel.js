const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // each message is embedded, not a separate document
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // buyer & seller
    messages: [messageSchema],
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // optional, link chat to a product
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
