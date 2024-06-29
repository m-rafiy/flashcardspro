// server/controllers/flashcardsController.js
const Flashcard = require('../models/Flashcard');

exports.getFlashcards = async (req, res) => {
  const userId = req.auth.sub;
  try {
    const flashcards = await Flashcard.find({ userId });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFlashcard = async (req, res) => {
  const userId = req.auth.sub;
  const { question, answer } = req.body;
  try {
    const newFlashcard = new Flashcard({ userId, question, answer });
    await newFlashcard.save();
    res.json(newFlashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFlashcard = async (req, res) => {
  const { id } = req.params;
  const { question, answer, rating } = req.body;
  try {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      id,
      { question, answer, rating },
      { new: true }
    );
    res.json(updatedFlashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFlashcard = async (req, res) => {
  const { id } = req.params;
  try {
    await Flashcard.findByIdAndDelete(id);
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
