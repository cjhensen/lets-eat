'use strict';


const express = require('express');

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// access to request body
const jsonParser = bodyParser.json();
const session = require('express-session');

const configDB = require('./config/database.js');
const configPort = require('./config/port.js');

mongoose.Promise = global.Promise;


const router = express.Router();
const app = express();





app.use(express.static('public')); // might need to change this due to server being in a folder

// read cookies
app.use(cookieParser());

// get info from html forms
app.use(bodyParser());

// passport
app.use(session({ secret: 'letseatappv1 '}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages stored in session
app.use(flash());

// load routes and pass in app and configured passport
require('./routes.js')(app, passport);











// require some request router
// const initialRouter = require('./initialRouter');
const yelpApiRouter = require('./yelpApiRouter');
const authRouter = require('./authRouter');

// setting up public directory


// use some request router
// app.use('/', initialRouter);
app.use('/restaurant-search', yelpApiRouter);
app.use('/login', authRouter);

let server;

// serve app to port
// function runServer() {
//   const port = process.env.PORT || 8080;
//   return new Promise((resolve, reject) => {
//     server = app.listen(port, () => {
//       console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//       resolve(server);
//     }).on('error', err => {
//       reject(err);
//     });
//   });
// }

function runServer(databaseUrl = configDB.DATABASE_URL, port = configPort.PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// function closeServer() {
//   return new Promise((resolve, reject) => {
//     console.log('Closing server');
//     server.close(err => {
//       if(err) {
//         reject(err);
//         return;
//       }
//       resolve();
//     });
//   });
// }

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// runServer if called by node server.js, but if testing, don't run server
// automatically because of asynch stuff
if(require.main === module) {
  runServer().catch(err => console.log(err));
};

module.exports = {
  app, 
  runServer,
  closeServer
};