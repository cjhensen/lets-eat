const leMenu = (function() {

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
  const leMenuTmpl = require('./leMenu-tmpl');

  // DOM
  const component = '.le-menu';
  const template = $(leMenuTmpl.generateTemplate());
  const leMenuToggle = `${component} .le-menu-toggle`;
  const leMenuNav = `${component} nav`;

  function handleMenuClicked() {
    toggleNavVisibility();
  }

  function toggleNavVisibility() {
    $(leMenuNav).toggleClass('show-nav');
  }

  function assignEventHandlers() {
    APP_CONTAINER.on('click', leMenuToggle, handleMenuClicked);
  }

  function render() {
    console.log('leMenu render');
    APP_CONTAINER.append(template);
  }

  render();
  assignEventHandlers();

})();

module.exports = leMenu;