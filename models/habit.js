const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  points: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
