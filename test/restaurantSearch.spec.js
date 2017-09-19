const chai = require('chai');
const should = chai.should();
const expect = chai.expect();
const sinon = require('sinon');

// jsdom allows you to test features of a web browser and jquery
const jsdom = require('jsdom');

const {JSDOM} = jsdom;

global.document = new JSDOM("");
global.$ = require('jquery')(global.document.window);
global.APP_CONTAINER = $('#le-app');

// const restaurantSearchTmpl = require('../src/components/restaurantSearch/restaurantSearch-tmpl');
const restaurantSearch = require('../src/components/restaurantSearch/restaurantSearch');
console.log(restaurantSearch);

// const app = require('../public/js/app.js');

describe('restaurantSearch', function() {
  describe('handleSearchBtnClicked', function() {
    it('should get values from the form', function() {
      const hsbSpy = expect.spyOn(restaurantSearch, 'handleSearchBtnClicked');
      expect(hsbSpy).toHaveBeenCalled();
    });
  });

  it('should do something else', function() {
  });

});