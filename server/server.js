'use strict';

// require express
const express = require('express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

// use express router for modular routes
const router = express.Router();

// create new app
const app = express();

// require some request router
const initialRouter = require('./initialRouter');
const yelpApiRouter = require('./yelpApiRouter');
const authRouter = require('./authRouter');

// setting up public directory
app.use(express.static('public')); // might need to change this due to server being in a folder

// use some request router
app.use('/', initialRouter);
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

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
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