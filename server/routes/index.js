const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const User = require('../models/users');  // Updated path
const mongoose = require('mongoose');


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'FlashcardsPro',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});




router.get('/dashboard', requiresAuth(), async (req, res) => {
  try {
    console.log('Connected to get info');
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
      user = new User({
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        flashcards: []
      });
      await user.save();
    }
    // Ensure we're passing flashcards, even if it's an empty array
    const flashcards = user.flashcards || [];
    res.render('dashboard', { user, flashcards });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});


router.post('/add-flashcard', requiresAuth(), async (req, res) => {
  console.log('add flashcard route hit');  // This should appear immediately

  try {
    const { question, answer, category } = req.body;
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        flashcards: []
      });
    }
    
    // Initialize flashcards array if it doesn't exist
    if (!user.flashcards) {
      user.flashcards = [];
    }
    
    // Add the new flashcard
    user.flashcards.push({ question, answer, category });
    await user.save();
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).send('Server error');
  }
});


router.post('/remove-flashcard', requiresAuth(), async (req, res) => {
  console.log('Remove flashcard route hit');  // This should appear immediately

  try {
    const { flashcardId } = req.body;
    console.log('Flashcard ID:', flashcardId);

    if (!flashcardId) {
      console.log('No flashcard ID provided');
      return res.status(400).send('No flashcard ID provided');
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    console.log('User found:', user ? user.auth0Id : 'No user found');

    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    const originalCount = user.flashcards.length;
    user.flashcards = user.flashcards.filter(card => card._id.toString() !== flashcardId);
    const newCount = user.flashcards.length;

    console.log(`Flashcards before: ${originalCount}, after: ${newCount}`);

    if (originalCount === newCount) {
      console.log('No flashcard was removed');
      return res.status(404).send('Flashcard not found');
    }

    await user.save();
    console.log('User saved successfully');

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error in remove-flashcard route:', error);
    res.status(500).send('Server error');
  } finally {
    console.log('Remove flashcard route completed');  // This should always appear
  }
});

module.exports = router;