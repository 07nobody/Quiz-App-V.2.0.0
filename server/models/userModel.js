const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    
    // Gamification fields
    level: {
      type: Number,
      default: 1,
    },
    totalExperiencePoints: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
    badges: {
      type: Array,
      default: [],
    },
    achievements: {
      type: Array,
      default: [],
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    stats: {
      quizzesCompleted: {
        type: Number,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        default: 0,
      },
      totalQuestions: {
        type: Number,
        default: 0,
      },
      perfectScores: {
        type: Number,
        default: 0,
      },
      categoryPerformance: {
        type: Map,
        of: {
          completed: Number,
          correct: Number,
          total: Number,
          avgScore: Number,
        },
        default: new Map(),
      },
    },
  },
  {
    timestamps: true,
  }
);

// Method to add experience points and handle leveling up
userSchema.methods.addExperiencePoints = function(points) {
  const oldLevel = this.level;
  this.totalExperiencePoints += points;
  
  // Calculate new level based on XP
  // Each level requires 10% more XP than previous level
  let xpThreshold = 100; // Level 1 to 2 requires 100 XP
  let accumulatedXP = 0;
  let newLevel = 1;
  
  while (this.totalExperiencePoints >= accumulatedXP + xpThreshold) {
    accumulatedXP += xpThreshold;
    newLevel++;
    xpThreshold = Math.floor(xpThreshold * 1.1); // 10% increase per level
  }
  
  // Update level if increased
  this.level = newLevel;
  
  // Return whether the user leveled up
  return this.level > oldLevel;
};

// Method to update user streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = this.lastActivityDate || today;
  
  // Check if last activity was yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isYesterday =
    lastActivity.getDate() === yesterday.getDate() &&
    lastActivity.getMonth() === yesterday.getMonth() &&
    lastActivity.getFullYear() === yesterday.getFullYear();
  
  // Check if last activity was today
  const isToday =
    lastActivity.getDate() === today.getDate() &&
    lastActivity.getMonth() === today.getMonth() &&
    lastActivity.getFullYear() === today.getFullYear();
  
  if (isYesterday) {
    // Increment streak if activity was yesterday
    this.currentStreak += 1;
  } else if (!isToday) {
    // Reset streak if more than a day has passed
    this.currentStreak = 1;
  }
  
  // Update longest streak if current is longer
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  // Update last activity date to today
  this.lastActivityDate = today;
};

// Method to award a badge to the user
userSchema.methods.awardBadge = function(badge) {
  // Check if badge already exists
  const badgeExists = this.badges.some(existingBadge => existingBadge.id === badge.id);
  
  if (!badgeExists) {
    badge.dateAwarded = new Date();
    this.badges.push(badge);
    return true;
  }
  
  return false;
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
