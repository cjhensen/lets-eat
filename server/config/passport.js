const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user.js');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // SIGNUP
  passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
      console.log('signing up');
      User.findOne({"userInfo.username": username}, function(err, user) {
        if(err) {
          console.log('signup error');
          return done(err);
        }
        if(user) {
          console.log('signup username already taken');
          return done(null, false, {message: 'Username already taken'});
        } else {
          console.log('creating new user');
          const newUser = new User();
          newUser.userInfo.username = username;
          newUser.userInfo.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    }
  ));

  // LOGIN
  passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
      User.findOne({"userInfo.username": username}, function(err, user) {
        if(err) { 
          return done(err); 
          console.log('login error');
        }
        if(!user) {
          console.log('login incorrect username (user not found)');
          return done(null, false, {message: 'Incorrect username (no user found)'});
        }
        if(!user.validPassword(password)) {
          console.log('login incorrect password');
          return done(null, false, {message: 'Incorrect password'});
        }
        console.log('login passed');
        return done(null, user);

      });
    }
  ));

}