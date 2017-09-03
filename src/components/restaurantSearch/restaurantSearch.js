const restaurantSearch = (function() {

  const template = generateRestaurantSearchTmpl.generateTemplate();

  function render() {
    console.log('rendering');
    console.log('template', template);
  }

  return {
    render: render
  }

})();