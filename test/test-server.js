// require assertion library
const chai = require('chai');

// require http assertion library
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// faker for mocking data
const faker = require('faker');
const mongoose = require('mongoose');

// bring in user model, test db url, and server exports
const {User} = require('../server/models/user');
const {TEST_DATABASE_URL} = require('../server/config/database');
const {app, runServer, closeServer} = require('../server/server');

// use chai should
const should = chai.should();

function seedUserData() {
  console.log('seeding User data');
  const seedData = [];

  seedData.push(generateUserData());

  return User.insertMany(seedData);
}

function generateUserData() {
  return {
    userInfo: {
      username: "adminTest",
      password: "adminTest"
    },
    history: [
    {
      "image_url" : "https://s3-media2.fl.yelpcdn.com/bphoto/F89PGb3un0nrL6qZcuN2Vg/o.jpg",
      "url" : "https://www.yelp.com/biz/soul-brew-saint-james?adjust_creative=9uuWiy9NVsgPlhsaTzRK9w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=9uuWiy9NVsgPlhsaTzRK9w",
      "rating" : 4,
      "price" : "$$",
      "name" : "Soul Brew",
      "id" : "soul-brew-saint-james"
    },
    {
      "image_url" : "https://s3-media2.fl.yelpcdn.com/bphoto/kjyqwQ5n5DOH6Zw9g00unQ/o.jpg",
      "url" : "https://www.yelp.com/biz/china-station-stony-brook?adjust_creative=9uuWiy9NVsgPlhsaTzRK9w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=9uuWiy9NVsgPlhsaTzRK9w",
      "rating" : 4.5,
      "price" : "$",
      "name" : "China Station",
      "id" : "china-station-stony-brook"
    }],
    liked: [
    {
      "image_url" : "https://s3-media2.fl.yelpcdn.com/bphoto/F89PGb3un0nrL6qZcuN2Vg/o.jpg",
      "url" : "https://www.yelp.com/biz/soul-brew-saint-james?adjust_creative=9uuWiy9NVsgPlhsaTzRK9w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=9uuWiy9NVsgPlhsaTzRK9w",
      "rating" : 4,
      "price" : "$$",
      "name" : "Soul Brew",
      "id" : "soul-brew-saint-james"
    }],
    disliked: [
    {
      "image_url" : "https://s3-media2.fl.yelpcdn.com/bphoto/kjyqwQ5n5DOH6Zw9g00unQ/o.jpg",
      "url" : "https://www.yelp.com/biz/china-station-stony-brook?adjust_creative=9uuWiy9NVsgPlhsaTzRK9w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=9uuWiy9NVsgPlhsaTzRK9w",
      "rating" : 4.5,
      "price" : "$",
      "name" : "China Station",
      "id" : "china-station-stony-brook"
    }]
  }
}

function tearDownDb() {
  console.log('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe.only('Lets Eat API', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET index endpoint', function() {
    it('should return 200 status code with HTML', function() {
      return chai.request(app)
        .get('/')
        .then(function(response) {
          response.should.have.status(200);
          response.type.should.equal('text/html');
        });
        done();
    });
  });
  
});