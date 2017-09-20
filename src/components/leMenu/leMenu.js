const leMenu = (function() {

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
  const leMenuTmpl = require('./leMenu-tmpl');

  // DOM
  const component = '.js-menu';
  const template = $(leMenuTmpl.generateTemplate());
  const leMenuToggle = `${component} .le-menu-toggle`;
  const leMenuNav = `${component} nav`;
  const leMenuNavItem = `${component} .nav-item`;

  // handleMenuClicked:
  // on menu button click, show menu
  function handleMenuClicked() {
    console.log('handleMenuClicked');
    toggleNavVisibility();
    toggleMenuButtonText();
  }

  // handleMenuItemClicked:
  // on menu item clicked, bring to that view, and hide menu
  function handleMenuItemClicked() {
    console.log('handleMenuItemClicked');
    event.preventDefault();
    toggleNavVisibility();
    toggleMenuButtonText();

    // bring to appropriate view
    // get the item clicked in the menu
    // send event to restaurantLists with the item to render the appropriate component
    const itemClicked = $(this).attr('data-item');
    console.log('itemClicked', itemClicked);

    if(itemClicked === "history" || itemClicked === "liked" || itemClicked === "disliked") {
      pubSub.emit('renderRestaurantList', {itemClicked: itemClicked, user: TEST_USER});
    }
  }

  // toggleNavVisibility:
  // toggle nav visibility through show-nav class
  function toggleNavVisibility() {
    $(leMenuNav).toggleClass('show-nav');
  }

  // toggleMenuButtonText:
  // if text is MENU, change to X. If X, change to MENU
  function toggleMenuButtonText() {
    const currentText = $(leMenuToggle).text();
    if(currentText === "MENU") {
      $(leMenuToggle).text("X");
    } else {
      $(leMenuToggle).text("MENU");
    }
  }

  function assignEventHandlers() {
    APP_CONTAINER.on('click', leMenuToggle, handleMenuClicked);
    APP_CONTAINER.on('click', leMenuNavItem, handleMenuItemClicked);
  }

  function render() {
    console.log('leMenu render');
    APP_CONTAINER.append(template);
  }

  render();
  assignEventHandlers();

})();

module.exports = leMenu;