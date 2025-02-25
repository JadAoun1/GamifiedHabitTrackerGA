const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g. "Added Habit", "Edited Habit"
  habit: { type: Schema.Types.ObjectId, ref: 'Habit' }, // optional reference
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
