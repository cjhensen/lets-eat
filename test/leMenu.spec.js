const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const simulant = require('jsdom-simulant');

const dom = new JSDOM('<body><div id="le-app"></div></body>', {runScripts: "dangerously"});
const jsdomWindow = dom.window;
const jsdomDocument = dom.window.document;

// global.window = jsdomWindow;
// global.document = jsdomDocument;

global.$ = require('jquery')(jsdomWindow);
const APP_CONTAINER = $(jsdomDocument).find('#le-app');

const leMenu = require('../src/components/leMenu').leMenu;

describe('leMenu', function() {
  it('should render the component to the DOM', function() {
    leMenu.render(APP_CONTAINER);
    expect(APP_CONTAINER.find('.le-menu').length).to.equal(1);
  });

  describe('menu button', function() {
    it('should show "MENU" text on button on menu closed state', function() {
      expect(APP_CONTAINER.find('.le-menu-toggle').text()).to.equal('MENU');
    });

    xit('should show "X" text on button on menu open state', function() {
      const event = simulant(jsdomWindow, 'click');
      // const element = APP_CONTAINER.find('.le-menu-toggle');
      const element = jsdomDocument.getElementsByClassName('le-menu-toggle')[0];
      console.log(APP_CONTAINER.find('button.le-menu-toggle').text());
      // APP_CONTAINER.find('.le-menu-toggle').trigger(event);
      simulant.fire(element, 'click');
      console.log(APP_CONTAINER.find('button.le-menu-toggle').text());
    });
  });
  
});