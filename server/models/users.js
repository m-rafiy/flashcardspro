const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String,
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  }
});

const deckSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  auth0Id: String,
  name: String,
  email: String,
  flashcards: {
    type: [flashcardSchema],
    default: []
  },
  decks: {
    type: [deckSchema],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);