const chai = require('chai');
const should = chai.should();

// jsdom allows you to test features of a web browser and jquery
const jsdom = require('jsdom');

const {JSDOM} = jsdom;

global.document = new JSDOM("");
global.$ = require('jquery')(global.document.window);

const restaurantSearchTmpl = require('./restaurantSearch-tmpl');
const restaurantSearch = require('./restaurantSearch');

describe('restaurantSearch', function() {
  it('should do something', function() {
  });

  it('should do something else', function() {
  });

});