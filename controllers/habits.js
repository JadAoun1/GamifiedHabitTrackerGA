const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');
const Activity = require('../models/activity');
const isSignedIn = require('../middleware/is-signed-in');

// GET /habits - List all habits and render the dashboard with recent activity etc.
router.get('/', isSignedIn, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.session.user._id });
    // Fetch recent activity for this user, sorted by most recent
    const recentActivityData = await Activity.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    // For achievements and upcoming goals, use empty arrays for now (or fetch if available)
    const achievementsData = [];
    const upcomingGoalsData = [];

    res.render('habits/index', { 
      habits, 
      recentActivity: recentActivityData,
      achievements: achievementsData,
      upcomingGoals: upcomingGoalsData,
      currentUser: req.session.user 
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// GET /habits/new - Render form to create a new habit
router.get('/new', isSignedIn, (req, res) => {
  res.render('habits/new');
});

// POST /habits - Create a new habit and log activity
router.post('/', isSignedIn, async (req, res) => {
  try {
    const habitData = req.body;
    habitData.user = req.session.user._id;
    const newHabit = await Habit.create(habitData);

    // Log activity for habit creation
    await Activity.create({
      user: req.session.user._id,
      action: 'Added Habit',
      habit: newHabit._id,
      description: `Added habit: ${newHabit.title}`
    });

    res.redirect('/habits');
  } catch (error) {
    console.error(error);
    res.redirect('/habits/new');
  }
});

// GET /habits/:id - Show a single habit's details and log a view activity
router.get('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/habits');
    }

    // Log view activity (optional)
    await Activity.create({
      user: req.session.user._id,
      action: 'Viewed Habit',
      habit: habit._id,
      description: `Viewed habit: ${habit.title}`
    });

    res.render('habits/show', { habit });
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// GET /habits/:id/edit - Render form to edit a habit
router.get('/:id/edit', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/habits');
    }
    res.render('habits/edit', { habit });
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// PUT /habits/:id - Update a habit and log edit activity
router.put('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/habits');
    }
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Log edit activity
    await Activity.create({
      user: req.session.user._id,
      action: 'Edited Habit',
      habit: updatedHabit._id,
      description: `Edited habit: ${updatedHabit.title}`
    });

    res.redirect(`/habits/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

// DELETE /habits/:id - Delete a habit and log delete activity
router.delete('/:id', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/habits');
    }
    await Habit.findByIdAndDelete(req.params.id);

    // Log deletion activity
    await Activity.create({
      user: req.session.user._id,
      action: 'Deleted Habit',
      habit: habit._id,
      description: `Deleted habit: ${habit.title}`
    });

    res.redirect('/habits');
  } catch (error) {
    console.error(error);
    res.redirect('/habits');
  }
});

module.exports = router;
