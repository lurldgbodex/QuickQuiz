const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const Quiz = require('../models/Quizzes');
const Score = require('../models/Scores');
const User = require('../models/Users');

const router = express.Router();
const methodOverride = require('method-override');


router.use(methodOverride('_method'));

//implement quiz creation functionality

// GET route to display a list of all quizzes
router.get('/',  async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: 'desc' }).populate('createdBy');
    const user = req.user;
    res.render('quizzes/index', { quizzes, user });
  } catch (err) {
    next(err);
  }
});

// display a form for creating a new quiz
router.get('/new', ensureAuthenticated, (req, res, next) => {
  const user = req.user
  res.render('quizzes/new', { user, quiz: new Quiz() });
});

// handle quiz creation submisstion
router.post('/new', ensureAuthenticated, async (req, res, next) => {
  const { title, questions } = req.body;
  const createdBy = req.user._id;
  const quiz = new Quiz({ title, questions, createdBy });
  const user = req.user;
  
  try {  
    await quiz.save();
    req.flash('success_msg', 'Quiz created Successfully')
    res.redirect(`/quizzes/`);
  } catch (err) {
    res.render('quizzes/new', { quiz, user, error_msg: err.message });;
  }
});

// display a form for editing a quiz
router.get('/:id/edit', ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  console.log(`Received PUT request for quiz ID ${id}`);
  const user = req.user;
  try {
    const quiz = await Quiz.findById(id);
    res.render('quizzes/edit', { quiz, user });
  } catch (err) {
    next(err);
  }
});

// PUT route to update a quiz
router.put('/:id/edit', ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { title, questions } = req.body;
  try {
    await Quiz.findByIdAndUpdate(id, { title, questions: questions.map((question) => {
      return {
        question: question.question,
        options: question.options,
        answer: question.answer
      };
    }) });
    req.flash('success_msg', 'Quiz updated successfully')
    res.redirect(`/quizzes`);
  } catch (err) {
    next(err);
  }
});

// DELETE route to delete a quiz and it's questions
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Quiz.findByIdAndDelete(id);
    req.flash('success_msg', 'Quiz deleted successfully')
    res.redirect('/quizzes');
  } catch (err) {
    next(err);
  }
});

// Ended quiz creation functionality


// Implementing quiz taking functionality

// Render the quiz page
router.get('/:id/take', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const quiz = await Quiz.findById(id);

    res.render('quizzes/take', {
      title: quiz.title,
      quizId : quiz._id,
      questions: quiz.questions,
      user
    })
  } catch (error) {
    req.flash('error_msg', 'Unable to find quiz');
    res.redirect('/quizzes/')
  }
});



// Submit the quiz answers
router.post('/:id/submit', ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params
  const user = req.user;
  const users = await User.findById(user.id);
  try {
    quiz = await Quiz.findById(id);
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const answer = req.body[`answer_${index}`];
  
      if (answer && answer === question.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const quizResult = new Score({
        quizId: quiz._Id,
        userId: user._id,
        score: score,
        percentage: percentage
    });

    await quizResult.save();

    users.quizzesTaken.push({
      quiz: quiz._id,
      score: percentage
    });
    
    await users.save();

    res.render('quizzes/score', {
      title: quiz.title,
      score: score,
      totalQuestions: quiz.questions.length,
      percentage: percentage,
      user
    });

  } catch (error) {
    req.flash('error_msg', error.message)
    res.redirect('/quizzes/');
  }
});



module.exports = router;