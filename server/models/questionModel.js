const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'matching', 'short-answer', 'essay'],
    default: 'multiple-choice'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 1
  },
  timeLimit: {
    type: Number, // in seconds, optional
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  explanation: {
    type: String, // For showing after answering
  },
  hints: [{
    text: String,
    pointDeduction: Number
  }],
  mediaUrl: {
    type: String, // For images, audio, or video
  },
  mediaType: {
    type: String,
    enum: ['image', 'audio', 'video', 'none'],
    default: 'none'
  },
  tags: [{
    type: String
  }],
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exams",
  },
}, {
  timestamps: true,
});

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
