//////////////
// DEPENDENCIES
//////////////

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const goalsController = require('./controllers/goals');
const habitsController = require('./controllers/habits.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Set the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

////////////
// MIDDLEWARE
////////////

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/goals', goalsController);


// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

////////
// ROUTES
////////

// Home route
app.get('/', (req, res) => {
  // If the user is signed in, redirect them to the habits page
  if (req.session.user) {
    res.redirect('/habits');
  } else {
    // Otherwise, show the public home page
    res.render('index');
  }
});

app.use('/auth', authController);
app.use(isSignedIn); // All routes below require a signed-in user

// Mount habits controller so that it handles routes under /habits
app.use('/habits', habitsController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});