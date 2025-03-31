const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    result: {
      type: Object,
      required: true,
    },
    // Enhanced leaderboard fields
    timeSpent: {
      type: Number, // Time spent in seconds
      default: 0,
    },
    score: {
      type: Number, // Calculated score
      default: 0,
    },
    accuracy: {
      type: Number, // Percentage of questions answered correctly
      default: 0,
    },
    experiencePoints: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number, // Current streak of correct answers
      default: 0,
    },
    achievements: [{
      type: String,
      enum: ["first_attempt", "perfect_score", "fast_finisher", "comeback", "challenge_completed"]
    }],
    // Track answers for analytics
    questionMetrics: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
      },
      timeToAnswer: Number, // Time in seconds to answer this question
      correct: Boolean,
      skipped: Boolean
    }]
  },
  {
    timestamps: true,
  }
);

const reportModel = mongoose.model("reports", reportSchema);

module.exports = reportModel;
