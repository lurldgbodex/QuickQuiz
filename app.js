const express = require('express');
const session = require('express-session');
const passport = require('./middleware/passport');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// const { errorHandler, notFoundHandler } = require('./middleware/error')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

//db config
const db = require('./dbconfig')
db.connection();


// set up ejs engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// set up middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash())

// Global variables for flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('error');
  next();
});

// set error middleware
// app.use(notFoundHandler);
// app.use(errorHandler);




// Routes

app.use('/', require('./routes/index'));
app.use('/auths', require('./routes/auth'));
app.use('/quizzes', require('./routes/quiz'));


// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}...`)
});

module.exports = app;