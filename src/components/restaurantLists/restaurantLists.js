// restaurantLists

  // Dependencies
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');
  const {Users} = require('../../models/userModel');

  // DOM
  const component = '.js-restaurant-list';
  // let template = $(restaurantListsTmpl.generateTemplate());
  const templateOptions = {};

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);

  function handleRenderRestaurantList(dataReceived) {
    console.log('dataReceived', dataReceived);
    console.log(Users);

    // remove from dom if it already exists
    destroy();
    
    // get list from users based on nav item clicked
    const listToDisplay = Users.get(TEST_USER, dataReceived.itemClicked);
    console.log('listToDisplay', listToDisplay);
    
    // setTemplateOptions
    templateOptions.title = dataReceived.itemClicked;
    templateOptions.list = listToDisplay;
    console.log('templateOptions', templateOptions);
    
    render();
  }

  function render() {
    console.log('restaurantLists render');
    let template = $(restaurantListsTmpl.generateTemplate(templateOptions));
    APP_CONTAINER.append(template);
  }

  function destroy() {
    if($(component).length) {
      console.log('restaurantLists destroy');
      $(component).remove();
    }
  }