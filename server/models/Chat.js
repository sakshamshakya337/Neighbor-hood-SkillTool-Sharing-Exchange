const mongoose = require("mongoose");

const getDirectChatKey = (participants = []) =>
  participants
    .map((participantId) => participantId.toString())
    .sort()
    .join(":");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    directChatKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

chatSchema.pre("validate", function () {
  if (this.participants?.length === 2) {
    this.directChatKey = getDirectChatKey(this.participants);
  }
});

chatSchema.statics.getDirectChatKey = getDirectChatKey;

module.exports = mongoose.model("Chat", chatSchema);
