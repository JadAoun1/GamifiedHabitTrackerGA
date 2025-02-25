const express = require('express');
const router = express.Router();
const Goal = require('../models/goal');
const isSignedIn = require('../middleware/is-signed-in');

router.post('/', isSignedIn, async (req, res) => {
  try {
    const goalData = {
      user: req.session.user._id,
      text: req.body.goal  // Ensure your form input is named "goal"
    };
    await Goal.create(goalData);
    res.redirect('/habits'); // Redirect back to dashboard
  } catch (error) {
    console.error("Error creating goal:", error);
    res.redirect('/habits');
  }
});

module.exports = router;
