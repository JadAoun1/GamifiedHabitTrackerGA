// controllers/habits.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');
const isSignedIn = require('../middleware/is-signed-in');

// List all habits for the logged-in user
router.get('/', isSignedIn, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.session.userId });
    res.render('habits/index', { habits });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Render form to create a new habit
router.get('/new', isSignedIn, (req, res) => {
  res.render('habits/new');
});

// Create a new habit
router.post('/', isSignedIn, async (req, res) => {
  try {
    const habitData = req.body;
    habitData.user = req.session.userId;
    await Habit.create(habitData);
    res.redirect('/habits');
  } catch (error) {
    console.error(error);
    res.redirect('/habits/new');
  }
});

// Show a single habit details
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.userId) {
      return res.redirect('/habits');
    }
    res.render('habits/show', { habit });
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// Render form to edit a habit
router.get('/:id/edit', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.userId) {
      return res.redirect('/habits');
    }
    res.render('habits/edit', { habit });
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// Update a habit
router.put('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.userId) {
      return res.redirect('/habits');
    }
    await Habit.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/habits/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// Delete a habit
router.delete('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.userId) {
      return res.redirect('/habits');
    }
    await Habit.findByIdAndDelete(req.params.id);
    res.redirect('/habits');
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

module.exports = router;
