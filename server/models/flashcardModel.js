const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'decks',
        required: true
    },
    // SM-2 algorithm parameters
    easeFactor: {
        type: Number,
        default: 2.5
    },
    interval: {
        type: Number,
        default: 0
    },
    repetitions: {
        type: Number,
        default: 0
    },
    nextReview: {
        type: Date,
        default: Date.now
    },
    // Study progress tracking
    studyHistory: [{
        date: Date,
        quality: Number, // 0-5 rating of response quality
        timeSpent: Number // time spent in milliseconds
    }],
    lastReviewed: {
        type: Date
    },
    status: {
        type: String,
        enum: ['new', 'learning', 'review', 'graduated'],
        default: 'new'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('flashcards', flashcardSchema);