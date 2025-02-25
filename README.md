
# Habit Tracker

## Overview

Habit Tracker is a full-stack web application built on the MEN stack (MongoDB, Express, and Node.js) with session-based authentication and EJS templates. The app enables users to add and manage their habits, check in on their progress based on custom frequencies (daily, weekly, or monthly), and see their activity history. 

## Features

- **User Authentication:**  
  Secure sign up, sign in, and sign out functionality using session-based authentication.
  
- **Habit Management (CRUD):**  
  Create, view, edit, and delete habits. Each habit is associated with a user and includes a description, frequency, check-ins, and a streak counter.
  
- **Activity Log:**  
  Records and displays user actions such as adding, editing, viewing, checking in, and deleting habits.

## Technologies Used

- **Back-End:**  
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - express-session
  - bcrypt

- **Front-End:**  
  - EJS Templates
  - Tailwind CSS
  - Method Override

- **Additional Tools:**  
  - Nodemon
  - PostCSS
  - Autoprefixer

## Next Steps / Future Enhancements

- **Enhanced Check-In Logic:**  
  Implement more robust logic to enforce check-ins based on habit frequency (daily, weekly, monthly) and compute streaks accurately.

- **Goal Management:**  
  Refine the goal creation and management system, and allow users to update or delete goals.

- **User Dashboard Enhancements:**  
  Add graphs and visualizations to track habit progress and achievements.

- **Notifications & Reminders:**  
  Integrate email or push notifications to remind users to check in on their habits.

## Attributions

- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Tailwind UI](https://tailwindui.com/) for design inspiration. 
- [Express.js](https://expressjs.com/) for the back-end framework.
- [MongoDB](https://www.mongodb.com/) for the database.


