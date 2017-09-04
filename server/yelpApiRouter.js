const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();


// Yelp yelp search model
const {YelpSearch} = require('./models');

// router.get('/', (request, response) => {
//   console.log(request.query.term);
//   console.log(request.query.location);
//   console.log(request.query.radius);
//   console.log(request.query.limit);
//   response.status(201).json({
//     'term': request.query.term,
//     'location': request.query.location,
//     'radius': request.query.radius,
//     'limit': request.query.limit
//   });
// });

router.get('/', (request, response) => {
  console.log('yelp api router get');
  response.json(YelpSearch.get(request.query.term, request.query.location, request.query.radius, request.query.limit));
});

module.exports = router;