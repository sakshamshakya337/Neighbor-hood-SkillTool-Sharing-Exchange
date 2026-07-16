const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const mongoose = require("mongoose");

const isParticipant = (chat, userId) =>
  chat.participants.some((participantId) => participantId.toString() === userId.toString());

// POST /chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  if (userId.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "Cannot create a chat with yourself" });
  }

  try {
    const otherUser = await User.findById(userId).select("_id");
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let isChat = await Chat.find({
      participants: { $all: [req.user._id, userId], $size: 2 },
    })
      .populate("participants", "-passwordHash")
      .populate("lastMessage");

    isChat = await Message.populate(isChat, {
      path: "lastMessage.senderId",
      select: "name email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        participants: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "participants",
        "-passwordHash"
      );
      res.status(200).send(fullChat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /chat
// Fetch all chats for a user
const fetchChats = async (req, res) => {
  try {
    let results = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
      .populate("participants", "-passwordHash")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    results = await Message.populate(results, {
      path: "lastMessage.senderId",
      select: "name email",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /chat/:id
// Get all messages for a specific chat
const getMessages = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid chat id" });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!isParticipant(chat, req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this chat" });
    }

    const messages = await Message.find({ chatId: req.params.id })
      .populate("senderId", "name email")
      .populate("chatId");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /chat/message (Helper to create a message if needed via REST, though Socket.io is better)
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !content.trim() || !chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!isParticipant(chat, req.user._id)) {
      return res.status(403).json({ message: "Not authorized to send messages in this chat" });
    }

    const newMessage = {
      senderId: req.user._id,
      text: content.trim(),
      chatId,
    };

    let message = await Message.create(newMessage);
    message = await message.populate("senderId", "name");
    message = await message.populate("chatId");
    message = await User.populate(message, {
      path: "chatId.participants",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
    
    // Create notification for other participants
    for (const participantId of chat.participants) {
      if (participantId.toString() !== req.user._id.toString()) {
        await createNotification(
          participantId,
          req.user._id,
          "message",
          "You have a new message.",
          chatId
        );
      }
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /chat/:id
const deleteChat = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid chat id" });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    // Only allow if user is part of the chat
    if (!isParticipant(chat, req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this chat" });
    }

    await Message.deleteMany({ chatId: req.params.id });
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { accessChat, fetchChats, getMessages, sendMessage, deleteChat };
