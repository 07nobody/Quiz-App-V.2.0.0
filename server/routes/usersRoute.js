const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Report = require("../models/reportModel");

// User registration
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Create new user
    const newUser = new User(req.body);
    await newUser.save();
    
    // Initialize user stats and achievements
    newUser.stats = {
      quizzesCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      perfectScores: 0,
      categoryPerformance: new Map()
    };
    
    // Add some default achievements
    newUser.achievements = [
      {
        name: "Quiz Explorer",
        description: "Complete 10 different quizzes",
        progress: 0,
        threshold: 10,
        completed: false
      },
      {
        name: "Knowledge Master",
        description: "Answer 100 questions correctly",
        progress: 0,
        threshold: 100,
        completed: false
      },
      {
        name: "Perfect Streak",
        description: "Get 5 perfect scores in a row",
        progress: 0,
        threshold: 5,
        completed: false
      },
      {
        name: "Category Expert",
        description: "Complete all quizzes in a category",
        progress: 0,
        threshold: 100, // This will be updated dynamically
        completed: false
      }
    ];
    
    await newUser.save();
    
    res.status(200).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(200).send({
        message: "Invalid password",
        success: false,
      });
    }

    // Update the streak if user is logging in
    user.updateStreak();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login successful",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get user info
router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    res.status(200).send({
      message: "User info fetched successfully",
      success: true,
      data: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        level: user.level,
        totalExperiencePoints: user.totalExperiencePoints,
        currentStreak: user.currentStreak
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get user progress data for dashboard
router.get("/progress/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user data with gamification fields
    const user = await User.findById(userId).select(
      "name email level totalExperiencePoints currentStreak longestStreak badges achievements stats lastActivityDate"
    );
    
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }
    
    // Get recent reports to calculate trends
    const recentReports = await Report.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("exam");
    
    // Calculate progress trends
    const trends = {
      accuracy: [],
      score: [],
      timeSpent: []
    };
    
    recentReports.forEach(report => {
      trends.accuracy.unshift(report.accuracy || 0);
      trends.score.unshift(report.score || 0);
      trends.timeSpent.unshift(report.timeSpent || 0);
    });
    
    // Update achievements progress based on user stats
    if (user.achievements && user.achievements.length > 0) {
      user.achievements = user.achievements.map(achievement => {
        switch (achievement.name) {
          case "Quiz Explorer":
            achievement.progress = Math.min(100, (user.stats.quizzesCompleted / achievement.threshold) * 100);
            achievement.completed = user.stats.quizzesCompleted >= achievement.threshold;
            break;
          case "Knowledge Master":
            achievement.progress = Math.min(100, (user.stats.correctAnswers / achievement.threshold) * 100);
            achievement.completed = user.stats.correctAnswers >= achievement.threshold;
            break;
          // Other achievements can be updated here
        }
        
        if (achievement.completed && !achievement.dateCompleted) {
          achievement.dateCompleted = new Date();
        }
        
        return achievement;
      });
      
      await user.save();
    }
    
    // Convert MongoDB Map to plain object for the response
    const formattedUser = user.toObject();
    if (formattedUser.stats && formattedUser.stats.categoryPerformance) {
      formattedUser.stats.categoryPerformance = Object.fromEntries(
        formattedUser.stats.categoryPerformance
      );
    }
    
    res.status(200).send({
      message: "User progress data fetched successfully",
      success: true,
      data: {
        ...formattedUser,
        trends
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
