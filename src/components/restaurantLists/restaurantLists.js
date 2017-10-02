// restaurantLists

  // Dependencies
  const globals = require('../../globals');
  const utilities = require('../../utilities/utilities'); // for makeDbRequest
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');

  // DOM
  const component = '.js-restaurant-list';
  // let template = $(restaurantListsTmpl.generateTemplate());
  const templateOptions = {};

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);
  pubSub.on('renderRestaurantSearch', destroy);
  pubSub.on('renderRestaurantChoose', destroy);

  function handleRenderRestaurantList(dataReceived) {
    console.log('dataReceived', dataReceived);

    // remove from dom if it already exists
    destroy();
    
    let listToDisplay = []; 
    
    // get list from users based on nav item clicked
    utilities.makeDbRequest('GET', dataReceived.itemClicked).then(function(data) {
      listToDisplay = data;
      console.log('listToDisplay', listToDisplay);

      templateOptions.title = dataReceived.itemClicked;
      templateOptions.list = listToDisplay;
      console.log('templateOptions', templateOptions);
      render();
    }).catch(function(err) {
      console.log(err);
    });

  }

  function render() {
    console.log('restaurantLists render');
    let template = $(restaurantListsTmpl.generateTemplate(templateOptions));
    globals.APP_CONTAINER.append(template);
  }

  function destroy() {
    if($(component).length) {
      console.log('restaurantLists destroy');
      $(component).remove();
    }
  }