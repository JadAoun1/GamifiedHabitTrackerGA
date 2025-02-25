const express = require('express');
const router = express.Router();
const Habit = require('../models/habit');
const Activity = require('../models/activity');
const isSignedIn = require('../middleware/is-signed-in');
const Goal = require('../models/goal');

// GET /habits - List all habits and render the dashboard with recent activity etc.
router.get('/', isSignedIn, async (req, res) => {
  try {
    let habits = await Habit.find({ user: req.session.user._id });
    habits = habits.map(habit => {
      if (habit.checkIns && habit.checkIns.length) {
        habit.streak = 1; 
      } else {
        habit.streak = 0;
      }
      return habit;
    });
    const upcomingGoalsData = await Goal.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    const recentActivityData = await Activity.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    
    res.render('habits/index', {
      habits,
      recentActivity: recentActivityData,
      achievements: [],
      upcomingGoals: upcomingGoalsData,  // Passing goals as upcomingGoals
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

// POST /habits/goals - Create a new goal for the current user
router.post('/goals', isSignedIn, async (req, res) => {
  try {
    const goalData = {
      user: req.session.user._id,
      text: req.body.goal  // ensure your form input is named "goal"
    };
    await Goal.create(goalData);
    res.redirect('/habits');
  } catch (error) {
    console.error("Error creating goal:", error);
    res.redirect('/habits');
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

// POST /habits/:id/checkin - Check in to a habit
router.post('/:id/checkin', isSignedIn, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.session.user._id.toString()) {
      return res.redirect('/habits');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCheckIn = habit.checkIns[habit.checkIns.length - 1];
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn);
      lastDate.setHours(0, 0, 0, 0);
      if (today.getTime() === lastDate.getTime()) {
        // Already checked in today for a daily habit.
        return res.redirect('/habits');
      }
    }

    habit.checkIns.push(new Date());
    await habit.save();

    // Log check-in activity
    await Activity.create({
      user: req.session.user._id,
      action: 'Checked In',
      habit: habit._id,
      description: `Checked in to habit: ${habit.title}`
    });

    res.redirect('/habits');
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
