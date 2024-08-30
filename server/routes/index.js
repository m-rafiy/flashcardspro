const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const User = require('../models/users');
const mongoose = require('mongoose');

router.get('/', async function (req, res, next) {
  if (req.oidc.isAuthenticated()) {
    try {
      const user = await User.findOne({ auth0Id: req.oidc.user.sub });
      const decks = user ? user.decks : [];
      res.render('index', {
        title: 'FlashcardsPro',
        isAuthenticated: true,
        user: req.oidc.user,
        decks: decks
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.render('index', {
        title: 'FlashcardsPro',
        isAuthenticated: true,
        user: req.oidc.user,
        decks: []
      });
    }
  } else {
    res.render('index', {
      title: 'FlashcardsPro',
      isAuthenticated: false
    });
  }
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
        flashcards: [],
        decks: [{ name: 'Default Deck', description: 'Your default deck' }]
      });
      await user.save();
    }
    const flashcards = Array.isArray(user.flashcards) ? user.flashcards : [];
    const decks = Array.isArray(user.decks) ? user.decks : [];
    
    console.log('User:', user);
    console.log('Flashcards:', flashcards);
    console.log('Decks:', decks);
    
    res.render('dashboard', { user, flashcards, decks });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});

router.post('/add-flashcard', requiresAuth(), async (req, res) => {
  console.log('add flashcard route hit');
  try {
    const { question, answer, category, deckId } = req.body;
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      user = new User({
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        flashcards: [],
        decks: [{ name: 'Default Deck', description: 'Your default deck' }]
      });
      await user.save();
    }

    if (!user.flashcards) {
      user.flashcards = [];
    }

    if (!user.decks || user.decks.length === 0) {
      user.decks = [{ name: 'Default Deck', description: 'Your default deck' }];
      await user.save();
    }

    const defaultDeckId = user.decks[0]._id;
    user.flashcards.push({ 
      question, 
      answer, 
      category, 
      deckId: deckId || defaultDeckId 
    });
    await user.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).send('Server error');
  }
});

router.post('/remove-flashcard', requiresAuth(), async (req, res) => {
  console.log('Remove flashcard route hit');
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
    console.log('Remove flashcard route completed');
  }
});

// New route to add a deck
router.post('/add-deck', requiresAuth(), async (req, res) => {
  try {
    const { name, description } = req.body;
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    user.decks.push({ name, description });
    await user.save();
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding deck:', error);
    res.status(500).send('Server error');
  }
});

// New route to remove a deck
router.post('/remove-deck', requiresAuth(), async (req, res) => {
  try {
    const { deckId } = req.body;
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    user.decks = user.decks.filter(deck => deck._id.toString() !== deckId);
    user.flashcards = user.flashcards.filter(card => card.deckId.toString() !== deckId);
    
    await user.save();
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error removing deck:', error);
    res.status(500).send('Server error');
  }
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;