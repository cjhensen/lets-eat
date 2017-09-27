const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  userInfo: {
    username: String,
    password: String
  },
  history: [{
    id: String,
    image_url: String,
    name: String,
    price: String,
    rating: Number,
    url: String
  }],
  liked: [{
    id: String,
    image_url: String,
    name: String,
    price: String,
    rating: Number,
    url: String
  }],
  disliked: [{
    id: String,
    image_url: String,
    name: String,
    price: String,
    rating: Number,
    url: String
  }]
});

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.userInfo.username,
    history: this.history,
    liked: this.liked,
    disliked: this.disliked
  }
}

userSchema.methods.generateHash = function(password) {
  console.log('generating password hash');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

userSchema.methods.validPassword = function(password) {
  console.log('validating password');
  return bcrypt.compareSync(password, this.userInfo.password);
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};