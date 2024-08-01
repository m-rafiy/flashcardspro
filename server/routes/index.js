const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');

// User model
const User = mongoose.model('User', new mongoose.Schema({
  auth0Id: String,
  name: String,
  email: String
}));

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
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
    let user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) {
      user = new User({
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email
      });
      await user.save();
    }
    res.render('dashboard', { user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;