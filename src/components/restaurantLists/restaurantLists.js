// restaurantLists

  // Dependencies
  const globals = require('../../globals');
  const pubSub = require('../../utilities/pubSub');
  const restaurantListsTmpl = require('./restaurantLists-tmpl');

  // DOM
  const component = '.js-restaurant-list';
  // let template = $(restaurantListsTmpl.generateTemplate());
  const templateOptions = {};

  // Subscribed Events
  pubSub.on('renderRestaurantList', handleRenderRestaurantList);

  // getDataFromDb:
  // uses a promise to get a specified list from the user from the db
  function getDataFromDb(arrayToGet) {
    return new Promise(function(resolve, reject) {
      const settings = {
        url: '/userdata',
        data: {
          "arrayToGet": arrayToGet
        },
        dataType: 'json',
        type: 'GET',
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(err);
        }
      };
      $.ajax(settings);
    });
  }

  function handleRenderRestaurantList(dataReceived) {
    console.log('dataReceived', dataReceived);

    // remove from dom if it already exists
    destroy();
    
    let listToDisplay = []; 

    // get list from users based on nav item clicked
    getDataFromDb(dataReceived.itemClicked).then(function(data) {
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