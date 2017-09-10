const restaurantVisited = (function() {

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