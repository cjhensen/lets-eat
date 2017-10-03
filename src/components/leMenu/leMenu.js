// leMenu

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const leMenuTmpl = require('./leMenu-tmpl');

  // DOM
  const component = '.js-menu';
  const template = $(leMenuTmpl.generateTemplate());
  const leMenuToggle = `${component} .le-menu-toggle`;
  const leMenuNav = `${component} nav`;
  const leMenuNavItem = `${component} .nav-item a`;

  // handleMenuClicked:
  // on menu button click, show menu
  function handleMenuClicked() {
    console.log('handleMenuClicked');
    toggleMenu();
  }

  function toggleMenu() {
    $('.site-wrap').toggleClass('nav-open');
    $('.nav').toggleClass('nav-visible');
    $('.nav-trigger').toggleClass('nav-trigger-open');
    $('label[for="nav-trigger"]').toggleClass('nav-trigger-open');
  }

  // handleMenuItemClicked:
  // on menu item clicked, bring to that view, and hide menu
  function handleMenuItemClicked() {
    console.log('handleMenuItemClicked');
    // bring to appropriate view
    // get the item clicked in the menu
    // send event to restaurantLists with the item to render the appropriate component
    const itemClicked = $(this).attr('data-item');
    if(itemClicked === "history" || itemClicked === "liked" || itemClicked === "disliked") {
      event.preventDefault();
      pubSub.emit('renderRestaurantList', {itemClicked: itemClicked});
      toggleMenu();
    }
    if(itemClicked === "search") {
      pubSub.emit('renderRestaurantSearch');
      toggleMenu();
    }
  }

  function assignEventHandlers() {
    globals.NAV_CONTAINER.on('click', leMenuToggle, handleMenuClicked);
    globals.NAV_CONTAINER.on('click', leMenuNavItem, handleMenuItemClicked);
  }

  function render(container) {
    container = container || globals.APP_CONTAINER;

    console.log('leMenu render');
    container.append(template);
  }

  render(globals.NAV_CONTAINER);
  assignEventHandlers();

  module.exports = {
    render: render
  }