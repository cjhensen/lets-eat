const chai = require('chai');
const should = chai.should();

// jsdom allows you to test features of a web browser and jquery
const jsdom = require('jsdom');

const {JSDOM} = jsdom;

global.document = new JSDOM("");
global.$ = require('jquery')(global.document.window);

// const restaurantSearchTmpl = require('../src/components/restaurantSearch/restaurantSearch-tmpl');
// const restaurantSearch = require('../src/components/restaurantSearch/restaurantSearch');
const app = require('../src/app');

describe('restaurantSearch', function() {
  it('should do something', function() {
  });

  it('should do something else', function() {
  });

});