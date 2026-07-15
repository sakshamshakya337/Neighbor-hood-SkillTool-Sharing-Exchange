const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    hourlyRate: {
      type: Number,
      required: true,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      address: String,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ location: "2dsphere" });
skillSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Skill", skillSchema);
