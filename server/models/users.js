const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: String,
  name: String,
  email: String
});

module.exports = mongoose.model('user', userSchema);
