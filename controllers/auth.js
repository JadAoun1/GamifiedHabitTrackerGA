const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// If user is already signed in, redirect to /habits

router.get('/sign-up', (req, res) => {
  if (req.session.user) {
    return res.redirect('/habits');
  }
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  if (req.session.user) {
    return res.redirect('/habits');
  }
  res.render('auth/sign-in.ejs');
});

// Logout route remains the same
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Error destroying session:', err);
      return res.redirect('/habits');
    }
    res.redirect('/');
  });
});

router.post('/sign-up', async (req, res) => {
  try {
    // Check if user is already signed in
    if (req.session.user) {
      return res.redirect('/habits');
    }

    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create the new user
    const newUser = await User.create(req.body);

    // Create session and redirect to /habits
    req.session.user = {
      username: newUser.username,
      _id: newUser._id
    };

    res.redirect('/habits');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    // If already signed in, redirect
    if (req.session.user) {
      return res.redirect('/habits');
    }

    // Get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }

    // Verify password
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }

    // Create session
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };

    // Redirect to habits index page
    res.redirect('/habits');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
