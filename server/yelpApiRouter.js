const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();



// Yelp Integration
const yelp = require('yelp-fusion');

// Authentication
const clientId = "9uuWiy9NVsgPlhsaTzRK9w";
const clientSecret = "lG04XrqFyv8T8fCq3DiPk40Q6COCgTlz6DFYlgwREAOajsRe4AYIe7eciDqAhiod";


router.get('/', (request, response) => {
  console.log('yelp api router get');

  let searchResults = [];

  yelp.accessToken(clientId, clientSecret).then(res => {
      const client = yelp.client(res.jsonBody.access_token);

      client.search({
        term: request.query.term,
        location: request.query.location,
        radius: parseInt(request.query.radius), // need to do a conversion from the client into meters
        limit: parseInt(request.query.limit)
      }).then(res => {
        // clear old array of search results first
        searchResults = [];

        // add search result items to storage
        res.jsonBody.businesses.forEach(function(business) {
          searchResults.push(business);
        });

        response.json(Object.keys(searchResults).map(key => searchResults[key]));

      });

    }).catch(e => {
      console.log(e);
    });
});

module.exports = router;