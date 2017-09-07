const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub


  // DOM
  const element = $('.js-restaurant-choose');
  const template = $(restaurantChooseTmpl.generateTemplate());

  // subscribed events
  pubSub.on('processSearchResults', render);

  function render(data) {
    console.log('restaurantChoose render');
    console.log('data from pubsub', data);
    element.append(template);
  }

  // render();

  return {
    render: render
  }

})();