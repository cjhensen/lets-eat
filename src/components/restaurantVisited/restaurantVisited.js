const restaurantVisited = (function() {

  // Dependencies
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');

  // DOM
  let template = $(restaurantVisitedTmpl.generateTemplate());
  const component = '.js-restaurant-visited';
  const btnGoBack = `${component} button:nth-child(1)`;
  const btnNotGoBack = `${component} button:nth-child(2)`;

  function handleBtnGoBackClicked() {
    console.log('handleBtnGoBackClicked');
  }

  function handleBtnNotGoBackClicked() {
    console.log('handleBtnNotGoBackClicked');
  }

  function assignEventHandlers() {
    APP_CONTAINER.on('click', btnGoBack, handleBtnGoBackClicked);
    APP_CONTAINER.on('click', btnNotGoBack, handleBtnNotGoBackClicked);
  }

  assignEventHandlers();

})();

module.exports = restaurantVisited;