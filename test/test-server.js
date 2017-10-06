// require assertion library
const chai = require('chai');
const expect = chai.expect;

// require http assertion library
const chaiHttp = require('chai-http');

// faker for mocking data
const faker = require('faker');
const mongoose = require('mongoose');

const request = require('supertest');

// use chai should
const should = chai.should();

// bring in user model, test db url, and server exports
const {User} = require('../server/models/user');
const {TEST_DATABASE_URL} = require('../server/config/database');
const {app, runServer, closeServer} = require('../server/server');

chai.use(chaiHttp);

// for password
const bcrypt = require('bcrypt-nodejs');


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
      password: bcrypt.hashSync("adminTestPw", bcrypt.genSaltSync(8), null),
      _id: 1234567890
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

  describe('LOGIN', function() {
    it('should redirect to / with incorrect or non-existent user info', function() {
      const noExistUser = {
        username: 'newUser',
        password: 'newUserPw'
      };

      return chai.request(app)
        .post('/login')
        .send(noExistUser)
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/');
        });
    });
    it('should redirect to /app with correct user info', function() {
      const existingUser = {
        username: "adminTest",
        password: "adminTestPw"
      };

      return chai.request(app)
        .post('/login')
        .send(existingUser)
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/app');
        });
    });
  });

  describe('SIGNUP', function() {
    it('should redirect to / with existing user info used as new user', function() {
      const existingUser = {
        username: "adminTest",
        password: "adminTestPw"
      };

      return chai.request(app)
        .post('/signup')
        .send(existingUser)
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/');
        });
    });

    it('should redirect to app with new user info', function() {
      const newUser = {
        userName: "newUser",
        userName: "newUserPw"
      };

      return chai.request(app)
        .post('/signup')
        .send(newUser)
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/app');
        });
    });
  });

  describe('LOGOUT', function() {
    it('should redirect to / on logout', function() {
      const existingUser = {
        username: 'adminTest',
        password: 'adminTestPw'
      };

      return chai.request(app)
        .post('/login')
        .send(existingUser)
        .then(function(response) {
          return chai.request(app)
            .get('/logout');
        })
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/');
        });
    });
  });

  describe.only('USERDATA', function() {
    const authenticatedUser = request.agent(app);

    const existingUser = {
      username: 'adminTest',
      password: 'adminTestPw'
    };


    before(function(done) {
      authenticatedUser
        .post('/login')
        .send(existingUser)
        .end(function(err, response) {
          expect('Location', '/app');
          done();
        });
    });
    describe('get user data list', function() {
      it('user should be logged in and navigate to /app', function(done) {
        authenticatedUser.get('/app')
        .expect('Location', '/app');
        done();
      });

      it('should return user list', function(done) {
        authenticatedUser.get('/userdata')
        .query({arrayToGet: 'history'})
        .then(function(response) {
          console.log('res', response);
          done();
        })
      })
    });
  });

});