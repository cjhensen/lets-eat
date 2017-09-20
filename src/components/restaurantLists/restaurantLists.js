const restaurantLists = (function() {

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');
  const {Users} = require('../../models/userModel');

  // DOM
  const component = '.js-restaurant-list';
  let template = $(restaurantListsTmpl.generateTemplate());
  const templateOptions = {};

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);

  function handleRenderRestaurantList(listType) {
    console.log('listType', listType);
    console.log(Users);

  }

  function render() {
    console.log('restaurantLists render');
    template = $(restaurantListsTmpl.generateTemplate(templateOptions));
    APP_CONTAINER.append(template);
  }

  render();

})();

module.exports = restaurantLists;