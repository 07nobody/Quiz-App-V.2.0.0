const router = require("express").Router();
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Add report
router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    const response = await newReport.save();
    
    // Calculate additional metrics for the leaderboard
    const timeSpent = req.body.secondsLeft ? req.body.examData.duration - req.body.secondsLeft : req.body.examData.duration;
    const correctAnswers = req.body.result.correctAnswers.length;
    const totalQuestions = req.body.examData.questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Calculate score based on accuracy and time
    let score = correctAnswers * 10; // Base score: 10 points per correct answer
    
    // Time bonus: faster completion gives more points
    const timePercentage = timeSpent / req.body.examData.duration;
    if (timePercentage < 0.6) {
      score += 20; // Fast completion bonus
    } else if (timePercentage < 0.8) {
      score += 10; // Good completion time bonus
    }
    
    // Achievement calculation
    let achievements = [];
    if (accuracy === 100) {
      achievements.push("perfect_score");
    }
    if (timePercentage < 0.5) {
      achievements.push("fast_finisher");
    }
    
    // Update the report with calculated metrics
    await Report.findByIdAndUpdate(response._id, {
      timeSpent,
      score,
      accuracy,
      experiencePoints: score,
      achievements
    });
    
    // Update user stats and award XP
    const user = await User.findById(req.body.user);
    if (user) {
      // Update user stats
      user.stats.quizzesCompleted += 1;
      user.stats.correctAnswers += correctAnswers;
      user.stats.totalQuestions += totalQuestions;
      
      if (accuracy === 100) {
        user.stats.perfectScores += 1;
      }
      
      // Update category performance
      const examData = await Exam.findById(req.body.exam);
      if (examData && examData.category) {
        const category = examData.category;
        
        if (!user.stats.categoryPerformance) {
          user.stats.categoryPerformance = new Map();
        }
        
        const categoryStats = user.stats.categoryPerformance.get(category) || {
          completed: 0,
          correct: 0,
          total: 0,
          avgScore: 0
        };
        
        categoryStats.completed += 1;
        categoryStats.correct += correctAnswers;
        categoryStats.total += totalQuestions;
        
        // Recalculate average score
        const totalScore = (categoryStats.avgScore * (categoryStats.completed - 1) + accuracy) / categoryStats.completed;
        categoryStats.avgScore = Math.round(totalScore);
        
        user.stats.categoryPerformance.set(category, categoryStats);
      }
      
      // Award XP points and update level
      const didLevelUp = user.addExperiencePoints(score);
      
      // Update streak
      user.updateStreak();
      
      // Award badges based on achievements and stats
      // Perfect score badge
      if (user.stats.perfectScores >= 5) {
        user.awardBadge({
          id: "perfect_score",
          name: "Perfect Scorer",
          description: "Achieved perfect scores in 5 or more quizzes",
          icon: "star"
        });
      }
      
      // Quiz master badge
      if (user.stats.quizzesCompleted >= 20) {
        user.awardBadge({
          id: "quiz_master",
          name: "Quiz Master",
          description: "Completed 20 or more quizzes",
          icon: "trophy"
        });
      }
      
      // Streak master badge
      if (user.currentStreak >= 7) {
        user.awardBadge({
          id: "streak_master",
          name: "Streak Master",
          description: "Maintained a 7-day streak",
          icon: "fire"
        });
      }
      
      await user.save();
      
      // If user leveled up, return that info
      if (didLevelUp) {
        return res.send({
          success: true,
          message: "Report added successfully",
          data: response,
          levelUp: {
            newLevel: user.level,
            xp: user.totalExperiencePoints
          }
        });
      }
    }
    
    res.send({
      success: true,
      message: "Report added successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get all reports by user
router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const { userId, examId } = req.body;
    const reports = await Report.find({
      user: userId,
      ...(examId && { exam: examId }),
    })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get leaderboard data
router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    const { timeFrame, category, type = 'global', userId } = req.query;
    
    // Set date range based on timeFrame
    const dateQuery = {};
    if (timeFrame === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateQuery.createdAt = { $gte: lastWeek };
    } else if (timeFrame === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      dateQuery.createdAt = { $gte: lastMonth };
    }
    
    // Apply category filter if specified
    let examFilter = {};
    if (category && category !== 'all') {
      const exams = await Exam.find({ category });
      const examIds = exams.map(exam => exam._id);
      examFilter = { exam: { $in: examIds } };
    }
    
    // Get friends list if type is friends
    let userFilter = {};
    if (type === 'friends' && userId) {
      const user = await User.findById(userId);
      if (user && user.friends && user.friends.length > 0) {
        userFilter = { user: { $in: [...user.friends, userId] } };
      } else {
        // If no friends, just show the user's data
        userFilter = { user: userId };
      }
    }
    
    // Get all unique categories
    const allExams = await Exam.find({});
    const categories = [...new Set(allExams.map(exam => exam.category))];
    
    // Aggregate data for leaderboard
    const leaderboardData = await Report.aggregate([
      {
        $match: {
          ...dateQuery,
          ...examFilter,
          ...userFilter
        }
      },
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          correctAnswers: { $sum: { $size: "$result.correctAnswers" } },
          totalQuestions: { $sum: { $size: "$result.correctAnswers" } },
          quizzesCompleted: { $sum: 1 },
          avgAccuracy: { $avg: "$accuracy" },
          lastActivityDate: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          userId: "$_id",
          name: "$userInfo.name",
          profileImage: "$userInfo.profileImage",
          score: "$totalScore",
          quizzesCompleted: 1,
          accuracy: { $round: ["$avgAccuracy", 0] },
          level: "$userInfo.level",
          streak: "$userInfo.currentStreak",
          badges: "$userInfo.badges",
          lastActivityDate: 1
        }
      },
      {
        $sort: { score: -1, accuracy: -1, quizzesCompleted: -1 }
      }
    ]);
    
    // Add rank to each entry
    const leaderboard = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    // Get user's rank if userId is provided
    let userRank = null;
    if (userId) {
      userRank = leaderboard.find(entry => entry.userId.toString() === userId);
    }
    
    res.send({
      success: true,
      message: "Leaderboard data fetched successfully",
      leaderboard,
      userRank,
      categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
