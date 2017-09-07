const restaurantChoose = (function() {

  // DOM
  const element = $('.js-restaurant-choose');
  const template = $(restaurantChooseTmpl.generateTemplate());

  function render() {
    console.log('restaurantChoose render');
    element.append(template);
  }
  
  render();

  return {
    render: render
  }
  
})();