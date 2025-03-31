const router = require('express').Router();
const Flashcard = require('../models/flashcardModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Calculate next review date using SM-2 algorithm
function calculateNextReview(quality, card) {
    if (quality < 0 || quality > 5) throw new Error('Quality must be between 0 and 5');

    let nextEF = card.easeFactor;
    let nextInterval = card.interval;
    let nextRepetitions = card.repetitions;

    if (quality >= 3) {
        if (nextRepetitions === 0) {
            nextInterval = 1;
        } else if (nextRepetitions === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(nextInterval * nextEF);
        }
        nextRepetitions++;
        
        // Update ease factor
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (nextEF < 1.3) nextEF = 1.3;
    } else {
        nextRepetitions = 0;
        nextInterval = 1;
        // Reduce ease factor but not below 1.3
        nextEF = Math.max(1.3, nextEF - 0.2);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + nextInterval);

    return {
        interval: nextInterval,
        easeFactor: nextEF,
        repetitions: nextRepetitions,
        nextReview
    };
}

// Get all flashcards for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ user: req.body.userId });
        res.status(200).send({
            success: true,
            data: flashcards
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Create new flashcard
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const newFlashcard = new Flashcard({
            ...req.body,
            user: req.body.userId
        });
        await newFlashcard.save();
        res.status(201).send({
            success: true,
            message: 'Flashcard created successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Record study session
router.post('/:id/study', authMiddleware, async (req, res) => {
    try {
        const { quality, timeSpent } = req.body;
        const flashcard = await Flashcard.findById(req.params.id);
        
        if (!flashcard) {
            return res.status(404).send({
                success: false,
                message: 'Flashcard not found'
            });
        }

        // Calculate next review using SM-2
        const nextReview = calculateNextReview(quality, flashcard);
        
        // Update flashcard
        flashcard.easeFactor = nextReview.easeFactor;
        flashcard.interval = nextReview.interval;
        flashcard.repetitions = nextReview.repetitions;
        flashcard.nextReview = nextReview.nextReview;
        flashcard.lastReviewed = new Date();
        
        // Add to study history
        flashcard.studyHistory.push({
            date: new Date(),
            quality,
            timeSpent
        });

        // Update status based on repetitions
        if (flashcard.repetitions === 0) {
            flashcard.status = 'learning';
        } else if (flashcard.repetitions > 4) {
            flashcard.status = 'graduated';
        } else {
            flashcard.status = 'review';
        }

        await flashcard.save();
        res.status(200).send({
            success: true,
            message: 'Study session recorded successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get due cards
router.get('/due', authMiddleware, async (req, res) => {
    try {
        const dueCards = await Flashcard.find({
            user: req.body.userId,
            nextReview: { $lte: new Date() }
        });
        res.status(200).send({
            success: true,
            data: dueCards
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get study statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const cards = await Flashcard.find({ user: req.body.userId });
        const stats = {
            total: cards.length,
            new: cards.filter(c => c.status === 'new').length,
            learning: cards.filter(c => c.status === 'learning').length,
            review: cards.filter(c => c.status === 'review').length,
            graduated: cards.filter(c => c.status === 'graduated').length,
            studyHistory: cards.reduce((acc, card) => {
                card.studyHistory.forEach(session => {
                    const date = session.date.toISOString().split('T')[0];
                    acc[date] = (acc[date] || 0) + 1;
                });
                return acc;
            }, {})
        };
        res.status(200).send({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Special debug endpoint - NO AUTH REQUIRED (REMOVE IN PRODUCTION)
router.get('/test', async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: 'Flashcards API is working correctly',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;