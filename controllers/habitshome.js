const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');

// Route to display the home page with the user's habits
router.get('/', async (req, res) => {
  try {
    // Retrieve habits for the signed-in user
    const habits = await Habit.find({ user: req.session.user._id });
    // Render the main index view and pass habits data to it
    res.render('index', { habits });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
