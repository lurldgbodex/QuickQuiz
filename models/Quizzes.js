const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
                trim: true,
            },
            options: [
                {
                    type: String,
                    required: true,
                    trim: true,
                },
            ],
            answer: {
                type: String,
                required: true,
                trim: true,
            }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
}, {
    timestamps: true,
})

const Quizzes = mongoose.model('Quizzes', quizSchema)

module.exports = Quizzes;