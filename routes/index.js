const express = require('express');
const {ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');
const User = require('../models/Users');

const router = express.Router();

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('index');
});


router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    try {

        const users = req.user;
        const user = await User.findById(users.id).populate('quizzesTaken.quiz');
        const quizzes = user.quizzesTaken.map(q => {
            return {
                questions: q.quiz.questions,
                score: q.score
            }
        });
        console.log(`Quizzes taken by ${user.name}:`);
        console.log(quizzes);
        res.render('users/dashboard', { user: users, quizzes });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', err.message)
        res.redirect('/quizzes');
    }
});

module.exports = router;