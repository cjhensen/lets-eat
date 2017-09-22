const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const should = chai.should();
const expect = chai.expect;

const jsdom = require('jsdom');

const {JSDOM} = jsdom;

global.document = new JSDOM("");
global.$ = require('jquery')(global.document.window);
global.APP_CONTAINER = $('#le-app');

const leLoader = require('../src/components/leLoader').leLoader;
console.log('leLoader', leLoader);

describe('leLoader', function() {

  before(function() {
    leLoader.render();
    leLoader.destroy();
  });

  describe('render', function() {
    it('should render a loader img to DOM', function() {
      const spy = chai.spy.on(leLoader, 'render');
      expect(spy).to.have.been.called();
      console.log('GA', global.APP_CONTAINER);
    });

    it('should remove a loader img from DOM', function() {

    });
  });
});