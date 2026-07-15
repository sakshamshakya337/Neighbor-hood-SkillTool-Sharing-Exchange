const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
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
        type: String, // Array of image URLs
      },
    ],
    pricePerDay: {
      type: Number,
      required: true,
      default: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Good",
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

toolSchema.index({ location: "2dsphere" });
toolSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Tool", toolSchema);
