'use strict';


const express = require('express');
const router = express.Router();
const pathVar = require('path');

const app = express();

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash'); // not using, get rid of it
mongoose.Promise = global.Promise;

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const session = require('express-session');

// config
const configDB = require('./config/database.js');
const configPort = require('./config/port.js');
require('./config/passport.js')(passport);

// static files
// app.use(express.static('dist/public'));
// app.use('/app', express.static('dist/app'));

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'letseatappv1'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// load routes and pass in app and configured passport
require('./routes.js')(app, passport, express, pathVar);
const yelpApiRouter = require('./yelpApiRouter');
app.use('/restaurant-search', yelpApiRouter);



let server;


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