// Yelp Integration
const yelp = require('yelp-fusion');

// Authentication
const clientId = "9uuWiy9NVsgPlhsaTzRK9w";
const clientSecret = "lG04XrqFyv8T8fCq3DiPk40Q6COCgTlz6DFYlgwREAOajsRe4AYIe7eciDqAhiod";

function StorageException(message) {
  this.message = message;
  this.name = "StorageException";
}

const YelpSearch = {
  // term [string] = food
  // location [string] = zipcode
  // radius [int], max is 25 miles
  // limit [int], max is 50
  get: function(term, location, radius, limit) {
    console.log('Getting yelp results');
    console.log(term, location, radius, limit);
    yelp.accessToken(clientId, clientSecret).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search({
        term: term,
        location: location,
        radius: parseInt(radius), // need to do a conversion from the client into meters
        limit: parseInt(limit)
      }).then(response => {
        // clear old array of search results first
        this.searchResults = [];

        const ls = this.searchResults;

        // add search result items to storage
        response.jsonBody.businesses.forEach(function(business) {
          ls.push(business);
          console.log(business.name);
        });
        // TODO: make the return work, its not working at all right now
        return Object.keys(this.searchResults).map(key => this.searchResults[key]);
      });
    }).catch(e => {
      console.log(e);
    });

  }
};

function createYelpSearchModel() {
  const storage = Object.create(YelpSearch);
  storage.searchResults = [];
  return storage;
}

module.exports = {YelpSearch: createYelpSearchModel()};