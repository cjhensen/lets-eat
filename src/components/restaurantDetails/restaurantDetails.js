const restaurantDetails = (function() {

  // Dependencies
  const restaurantDetailsTmpl = require('./restaurantDetails-tmpl');
  const pubSub = require('../../utilities/pubSub');

  // DOM
  let template = $(restaurantDetailsTmpl.generateTemplate());
  const component = '.js-restaurant-details';
  const btnEatHere = `${component} button.btn-eat-here`;
  const templateOptions = {};

  // Subscribed Events
  // on image click in restaurantChoose, pass the current restaurant in
  // and show the details view
  pubSub.on('showDetailsView', handleShowDetailsView);

  // handleShowDetailsView:
  // destroys currently shown template
  // sets template options to currentRestaurant
  // re-renders component
  function handleShowDetailsView(currentRestaurant) {
    console.log('handleShowDetailsView');
    destroy();
    setTemplateOptions(currentRestaurant);
    render();
  }

  // setTemplateOptions:
  // sets template options to received current restaurant
  function setTemplateOptions(restaurant) {
    templateOptions.title = restaurant.name;
    templateOptions.rating = restaurant.rating;
    templateOptions.price = restaurant.price;
    templateOptions.img_src = restaurant.image_url;
    templateOptions.img_alt = restaurant.name;
    templateOptions.address_1 = restaurant.location.display_address[0];
    templateOptions.address_2 = restaurant.location.display_address[1];
    templateOptions.phone = restaurant.display_phone;
    templateOptions.yelp_url = restaurant.url;
  }

  // render:
  // render the component
  function render() {
    console.log('restaurantDetails render');
    template = $(restaurantDetailsTmpl.generateTemplate(templateOptions));
    APP_CONTAINER.append(template);
  }

  // destroy:
  // remove component from DOM
  function destroy() {
    console.log('restaurantDetails destroy');
    $(component).remove();
  }
  

})();

module.exports = restaurantDetails;