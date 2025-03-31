const router = require("express").Router();
const Deck = require("../models/deckModel");
const Flashcard = require("../models/flashcardModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new deck
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const newDeck = new Deck({
      ...req.body,
      userId: req.body.userId,
    });
    await newDeck.save();
    res.status(201).send({
      message: "Deck created successfully",
      success: true,
      data: newDeck,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get user's decks
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const decks = await Deck.find({
      $or: [
        { userId },
        { "sharedWith.userId": userId },
        { visibility: "public" }
      ]
    }).populate("userId", "name email");
    
    res.status(200).send({
      message: "Decks retrieved successfully",
      success: true,
      data: decks,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Update deck
router.put("/:deckId", authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    
    // Check ownership or edit permission
    if (deck.userId.toString() !== req.body.userId &&
        !deck.sharedWith.some(share => 
          share.userId.toString() === req.body.userId && 
          share.permission === "edit"
        )) {
      return res.status(403).send({
        message: "Not authorized to edit this deck",
        success: false,
      });
    }

    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      req.body,
      { new: true }
    );

    res.status(200).send({
      message: "Deck updated successfully",
      success: true,
      data: updatedDeck,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Delete deck
router.delete("/:deckId", authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    
    // Check ownership
    if (deck.userId.toString() !== req.body.userId) {
      return res.status(403).send({
        message: "Not authorized to delete this deck",
        success: false,
      });
    }

    // Delete associated flashcards
    await Flashcard.deleteMany({ deckId });
    
    // Delete deck
    await Deck.findByIdAndDelete(deckId);

    res.status(200).send({
      message: "Deck and associated flashcards deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Share deck with users
router.post("/:deckId/share", authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.params;
    const { users, permission } = req.body;
    const deck = await Deck.findById(deckId);
    
    // Check ownership
    if (deck.userId.toString() !== req.body.userId) {
      return res.status(403).send({
        message: "Not authorized to share this deck",
        success: false,
      });
    }

    // Update shared users
    deck.sharedWith = users.map(userId => ({ userId, permission }));
    deck.visibility = "shared";
    await deck.save();

    res.status(200).send({
      message: "Deck shared successfully",
      success: true,
      data: deck,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get deck statistics
router.get("/:deckId/stats", authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    
    // Check access
    if (deck.visibility !== "public" && 
        deck.userId.toString() !== req.body.userId &&
        !deck.sharedWith.some(share => share.userId.toString() === req.body.userId)) {
      return res.status(403).send({
        message: "Not authorized to view this deck's statistics",
        success: false,
      });
    }

    const flashcards = await Flashcard.find({ deckId });
    const stats = {
      totalCards: flashcards.length,
      masteredCards: flashcards.filter(card => card.confidenceLevel >= 4).length,
      needsReview: flashcards.filter(card => 
        card.nextReview && card.nextReview <= new Date()
      ).length,
      averageConfidence: flashcards.reduce((acc, card) => 
        acc + card.confidenceLevel, 0) / flashcards.length || 0,
      studyStreak: deck.studyStreak,
      lastStudied: deck.lastStudied
    };

    res.status(200).send({
      message: "Statistics retrieved successfully",
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get review schedule
router.get("/:deckId/schedule", authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    
    // Check access
    if (deck.userId.toString() !== req.body.userId &&
        !deck.sharedWith.some(share => share.userId.toString() === req.body.userId)) {
      return res.status(403).send({
        message: "Not authorized to view this deck's schedule",
        success: false,
      });
    }

    const schedule = {
      type: deck.reviewSchedule,
      customSchedule: deck.customSchedule,
      dueCards: await Flashcard.countDocuments({
        deckId,
        nextReview: { $lte: new Date() }
      })
    };

    res.status(200).send({
      message: "Schedule retrieved successfully",
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;