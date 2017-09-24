// require assertion library
const chai = require('chai');

// require http assertion library
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// bring in our server exports (destructuring)
const {app, runServer, closeServer} = require('../server/server');

// use chai should
const should = chai.should();

describe('Lets Eat API', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
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