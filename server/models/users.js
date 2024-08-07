const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String
});

const userSchema = new mongoose.Schema({
  auth0Id: String,
  name: String,
  email: String,
  flashcards: {
    type: [flashcardSchema],
    default: []  // This ensures the field is always an array
  }
});

module.exports = mongoose.model('User', userSchema);