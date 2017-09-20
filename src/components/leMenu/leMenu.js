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
    toggleNavVisibility();
    toggleMenuButtonText();
    // bring to appropriate view
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