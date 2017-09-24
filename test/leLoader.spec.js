const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const dom = new JSDOM('<body><div id="le-app"></div></body>', {runScripts: "outside-only"});
const jsdomWindow = dom.window;
const jsdomDocument = dom.window.document;

// global.window = jsdomWindow;
// global.document = jsdomDocument;

global.$ = require('jquery')(jsdomWindow);
const APP_CONTAINER = $(jsdomDocument).find('#le-app');


const leLoader = require('../src/components/leLoader').leLoader;

describe('leLoader', function() {

  it('should render the loader template to the DOM', function() {
    leLoader.render(APP_CONTAINER);
    expect(APP_CONTAINER.find('.le-loader').length).to.equal(1);
    console.log('after render', APP_CONTAINER.html());
  });

  it('should remove the loader template from the DOM', function() {
    leLoader.destroy(APP_CONTAINER);
    expect(APP_CONTAINER.find('.le-loader').length).to.equal(0);
  });
});