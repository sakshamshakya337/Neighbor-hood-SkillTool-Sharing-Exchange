const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  getMessages,
  sendMessage,
  deleteChat,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/message").post(protect, sendMessage);
router.route("/:id").get(protect, getMessages).delete(protect, deleteChat);

module.exports = router;
