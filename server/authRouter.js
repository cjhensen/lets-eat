const express = require('express');

// Passport for auth
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const router = express.Router();

const {Users} = require('./models');


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('valid user');
      return done(null, user);
    });
  }
));


router.get('/', (request, response) => {
  Users
    .find()
    .exec()
    .then(users => {
      response.json({
        users: users.map(
          (user) => user.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

// router.post('/', jsonParser, (request, response) => {
//   const requiredFields = ['username', 'password'];
//   for(let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if(!(field in request.body)) {
//       const message = `Missing \'${field}\' in request body`;
//       console.error(message);
//       return response.status(400).send(message);
//     }
//   }

//   Users.create({
//     username: request.body.username,
//     password: request.body.password
//   })
//   .then(
//     user => response.status(201).json(user.apiRepr()))
//   .catch(err => {
//     console.log(err);
//     response.status(500).json({message: 'Internal server error'});
//   });
// });

router.post('/', passport.authenticate('local'));

router.put('/:id', jsonParser, (request, response) => {

});

router.delete('/:id', (request, response) => {

});

module.exports = router;