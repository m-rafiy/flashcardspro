const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const User = require('../models/users');  // Updated path

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
    console.log('Connected to database to get info')
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