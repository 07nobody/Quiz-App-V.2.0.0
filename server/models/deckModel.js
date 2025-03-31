const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private",
    },
    sharedWith: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      permission: {
        type: String,
        enum: ["view", "edit"],
        default: "view",
      }
    }],
    tags: [{
      type: String,
    }],
    totalCards: {
      type: Number,
      default: 0,
    },
    lastStudied: {
      type: Date,
    },
    studyStreak: {
      type: Number,
      default: 0,
    },
    reviewSchedule: {
      type: String,
      enum: ["daily", "spaced", "custom"],
      default: "spaced",
    },
    customSchedule: {
      type: Map,
      of: Date,
    }
  },
  {
    timestamps: true,
  }
);

// Create indexes
deckSchema.index({ userId: 1 });
deckSchema.index({ category: 1 });
deckSchema.index({ visibility: 1 });
deckSchema.index({ "sharedWith.userId": 1 });

const Deck = mongoose.model("decks", deckSchema);
module.exports = Deck;