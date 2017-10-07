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

describe('Lets Eat API', function() {
  before(function(done) {
    // return runServer(TEST_DATABASE_URL);
    
    runServer(TEST_DATABASE_URL)
    .then(seedUserData()
      .then(function() {
      done();
    }));
  });

  beforeEach(function() {
    // return seedUserData();
  });

  afterEach(function() {
    // return tearDownDb();
  });

  after(function(done) {
    // return closeServer();
    
    tearDownDb()
    .then(closeServer()
      .then(function() {
      done();
    }));
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
        username: "newUser",
        password: "newUserPw"
      };

      return chai.request(app)
        .post('/signup')
        .send(newUser)
        .then(function(response) {
          expect(response.status).to.equal(200);
          expect('Location', '/app');
        });
    });

    it('should add new user to db through POST', function() {
      const newUser2 = {
        userName: "newUser",
        password: "newUser2pw"
      };

      return chai.request(app)
        .post('/userdata')
        .send(newUser2)
        .then(function(response) {
          expect(response.statusCode).to.equal(201);
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

  describe('USERDATA', function() {

    const userCredentials = {
        username: 'adminTest',
        password: 'adminTestPw'
      };

    const authenticatedUser = request.agent(app);

    before(function(done) {
      authenticatedUser
        .post('/login')
        .send(userCredentials)
        .end(function(err, response) {
          expect(response.statusCode).to.equal(302);
          expect('Location', '/app');
          done();
        });
    });

    describe('GET user list', function() {
      it('should return the specified user data list (history)', function(done) {
        authenticatedUser.get('/userdata')
        .query({arrayToGet: 'history'})
        .end(function(err, response) {
          expect(response.body).to.be.a('array');
          expect(response.body[0]).to.include.keys('image_url', 'url', 'rating', 'price', 'name', 'id');
          expect(response).to.be.json;
          done();
        });
      });

      it('should return the specified user data list (liked)', function(done) {
        authenticatedUser.get('/userdata')
        .query({arrayToGet: 'liked'})
        .end(function(err, response) {
          expect(response.body).to.be.a('array');
          expect(response.body[0]).to.include.keys('image_url', 'url', 'rating', 'price', 'name', 'id');
          expect(response).to.be.json;
          done();
        });
      });

      it('should return the specified user data list (disliked)', function(done) {
        authenticatedUser.get('/userdata')
        .query({arrayToGet: 'disliked'})
        .end(function(err, response) {
          expect(response.body).to.be.a('array');
          expect(response.body[0]).to.include.keys('image_url', 'url', 'rating', 'price', 'name', 'id');
          expect(response).to.be.json;
          done();
        });
      });
    });
    
    describe('PUT user list item', function() {
      it('should add a new item to a user list (history)', function(done) {
        const objToInsert = {
          history: {
            image_url: "image url",
            url: "url",
            rating: 4,
            price: "$$",
            name: "test restaurant",
            id: 'test-restaurant-id'
          }
        };

        authenticatedUser.put('/userdata')
          .query(objToInsert)
          .end(function(err, response) {
            expect(response.statusCode).to.equal(204);
            done();
          });
      });
    });

    describe('DELETE user list item', function() {
      it('should delete a restaurant from user list (history)', function(done) {
        authenticatedUser.delete('/userdata/history/china-station-stony-brook')
          .then(function(response) {
            expect(response.statusCode).to.equal(204);

            authenticatedUser.get('/userdata')
              .query({arrayToGet: "history"})
              .end(function(err, response) {
                expect(response.body).to.not.include({id: "china-station-stony-brook"});
                expect(response.statusCode).to.equal(200);
                done();
              });
          });
      });
    });

  });

});