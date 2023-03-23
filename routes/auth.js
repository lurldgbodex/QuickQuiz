const express = require('express');
const passport = require('../middleware/passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const User = require('../models/Users');

const router = express.Router();

hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  const { name, email, password, password2 } = req.body
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' })
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' })
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }
  
  if (errors.length > 0) {
    res.render('register', {errors, name, email, password, password2})
  } else {
    try {
      const encryptPassword = await hashPassword(password)
      const user = new User({
      name,
      email,
      password: encryptPassword,
    });
    await user.save();
    req.flash('success_msg', 'Your account has been created! Please log in.');
    res.redirect('/auths/login');  
    } catch (err) {
      if (err.code === 11000) {
        console.log(err.message)
        req.flash('error_msg', 'Email address already registered.')
        return res.redirect('/auths/register')
      }
      next(err);
    }
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/quizzes',
    failureRedirect: '/auths/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  req.flash('success_msg', 'You are logged out')
  res.redirect('/auths/login');
  });
});

router.get('/forgot', (req, res) => {
  res.render('forgot', { title: 'Forgot Password' })
})

router.post('/forgot', async (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString('hex');
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash('error_msg', 'No account with that email address exists.');
      return res.redirect('/auths/forgot');
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.MAIL_USER,
      subject: 'QuickQuiz App Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${req.protocol}://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    req.flash('success_msg', 'An email has been sent to ' + user.email + ' with further instructions.');
    res.redirect('/auths/login');
  } catch (err) {
    next(err);
  }
})

router.get('/reset', async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }

    res.render('reset', { title: 'Reset Password', token: req.params.token });
  } catch (err) {
    next(err);
  }
})

router.post('/reset', async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }

    user.password = await User.encryptPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.MAIL_USER,
      subject: 'QuickQuiz App Password Has Been Changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };

    await transporter.sendMail(mailOptions);
    req.flash('success_msg', 'Your password has been reset.');
    res.redirect('/auths/login')
  } catch(err) {
    next(err);
  }
})

module.exports = router;