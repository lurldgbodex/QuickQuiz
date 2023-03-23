const mongoose= require('mongoose');

const scoreSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Types.ObjectId,
        ref: 'Quizzes'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    score: {
        type: Number,
    },

    percentage: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Scores = mongoose.model('Scores', scoreSchema)

module.exports = Scores;