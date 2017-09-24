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

const leMenu = require('../src/components/leMenu').leMenu;

describe('leMenu', function() {
  it('should do something', function() {
    
  });
});