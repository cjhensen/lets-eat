const restaurantVisited = (function() {

  // Dependencies
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');

  const componentElementSelector = $('.js-restaurant-visited-container');
  let template = $(restaurantVisitedTmpl.generateTemplate());

  function render() {
    componentElementSelector.html(template);
  }

  // render();
  return {
    render: render
  }
})();

module.exports = restaurantVisited;