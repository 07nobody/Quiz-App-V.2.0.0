const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions',
      },
    ],
    // New fields added for timer customization
    timerType: {
      type: String,
      enum: ['fixed', 'flexible', 'perQuestion'],
      default: 'fixed',
      required: true,
    },
    timerSettings: {
      timePerQuestion: {
        type: Number, // Time in seconds per question (for perQuestion type)
        default: 60,
      },
      showTimer: {
        type: Boolean,
        default: true,
      },
      allowTimeExtension: {
        type: Boolean,
        default: false,
      },
      maxTimeExtension: {
        type: Number, // Maximum additional time in minutes 
        default: 0,
      },
      warningTime: {
        type: Number, // Time in minutes when warning appears
        default: 5,
      }
    },
    // Accessibility settings
    accessibilitySettings: {
      extraTimeUsers: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
          },
          extraTimePercentage: {
            type: Number, // Extra time as percentage of total duration
            default: 25, // Common accommodation is 25% extra time
          },
          reason: {
            type: String,
            default: 'Accessibility accommodation',
          }
        }
      ],
      highContrastMode: {
        type: Boolean,
        default: false,
      },
      largerText: {
        type: Boolean, 
        default: false,
      }
    }
  },
  {
    timestamps: true,
  }
);

const examModel = mongoose.model('exams', examSchema);

module.exports = examModel;
