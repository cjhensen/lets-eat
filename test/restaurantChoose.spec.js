const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const dom = new JSDOM('<body><div id="le-app"><div class="js-restaurant-search-container"></div></div></body>', {runScripts: "outside-only"});
const jsdomWindow = dom.window;
const jsdomDocument = dom.window.document;

// global.window = jsdomWindow;
// global.document = jsdomDocument;

global.$ = require('jquery')(jsdomWindow);
const APP_CONTAINER = $(jsdomDocument).find('#le-app');
const restaurantChooseContainer = $(jsdomDocument).find('.js-restaurant-search-container');

const restaurantChoose = require('../src/components/restaurantChoose').restaurantChoose;

describe('restaurantChoose', function() {
  describe('render', function() {
    it('should render the restaurantChoose component to the page', function() {
      restaurantChoose.render(restaurantChooseContainer);
      expect(APP_CONTAINER.find('.js-restaurant-choose').length).to.equal(1);
    });

    it('should remove the restaurantChoose component from the DOM', function() {
      restaurantChoose.destroy(restaurantChooseContainer);
      expect(APP_CONTAINER.find('.js-restaurant-choose').length).to.equal(0);
    });
  });
});