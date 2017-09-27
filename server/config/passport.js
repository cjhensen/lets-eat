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

  passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
      User.findOne({username: username}, function(err, user) {
        if(err) {
          return done(err);
        }
        if(user) {
          return done(null, false, {message: 'Username already taken'});
        } else {
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


}