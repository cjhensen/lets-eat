// restaurantVisited

  // Dependencies
  const globals = require('../../globals');
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');
  const pubSub = require('../../utilities/pubSub');

  // DOM
  let template = $(restaurantVisitedTmpl.generateTemplate());
  const component = '.js-restaurant-visited';
  const btnGoBack = `${component} button:nth-child(1)`;
  const btnNotGoBack = `${component} button:nth-child(2)`;

  // Subscribed Events
  // Received from restaurantChoose on already been here button click
  pubSub.on('displayVisitedPopup', handleReceivedPopupData);

  // Module variables. Used for received data via event subscription.
  let currentUser = {};
  let currentRestaurant = {};

  // handleReceivedPopupData:
  // set the local data equal to received data so it can be passed around in the module
  // show the component
  function handleReceivedPopupData(data) {
    console.log('handleVisitedPopupShown');
    
    // reset local data on popup activated
    currentUser = {};
    currentRestaurant = {};

    // set local data equal to received data from showing popup via click
    currentUser = data.user;
    currentRestaurant = data.restaurant;

    showComponent();
  }

  function putDataInDb(objToInsert, array1, array2) {
    return new Promise(function(resolve, reject) {
        const settings = {
          url: '/userdata',
          data: {
          },
          dataType: 'json',
          type: 'PUT',
          success: function(data) {
            resolve(data);
          },
          error: function(err) {
            reject(err);
          }
        };
        settings.data[array1] = objToInsert;
        settings.data[array2] = objToInsert
        $.ajax(settings);
    });
  }

  // handleBtnGoBackClicked:
  // updates the current user history and liked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnGoBackClicked() {
    console.log('handleBtnGoBackClicked');

    console.log('currentRestaurant', currentRestaurant);

    // Add restaurant to history list and liked list
    let objToInsert = {
      id: currentRestaurant.id, 
      name: currentRestaurant.name, 
      price: currentRestaurant.price, 
      rating: currentRestaurant.rating, 
      url: currentRestaurant.url, 
      image_url: currentRestaurant.image_url
    };

    putDataInDb(objToInsert, "history", "liked").then(function(data) {
      pubSub.emit('showNextSearchResult');
    }).catch(function(err) {
      console.log(err);
    });
  }

  // handleBtnNotGoBackClicked:
  // updates the current user history and disliked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnNotGoBackClicked() {
    console.log('handleBtnNotGoBackClicked');

    // Add restaurant to history list and liked list
    let objToInsert = {
      id: currentRestaurant.id, 
      name: currentRestaurant.name, 
      price: currentRestaurant.price, 
      rating: currentRestaurant.rating, 
      url: currentRestaurant.url, 
      image_url: currentRestaurant.image_url
    };
    putDataInDb(objToInsert, "history", "disliked").then(function(data) {
      hideComponent();

      // Send event to show next result in restaurantChoose
      pubSub.emit('showNextSearchResult');   
    }).catch(function(err) {
      console.log(err);
    });
  }

  function assignEventHandlers() {
    console.log('restaurantVisited assignEventHandlers');
    globals.APP_CONTAINER.on('click', btnGoBack, handleBtnGoBackClicked);
    globals.APP_CONTAINER.on('click', btnNotGoBack, handleBtnNotGoBackClicked);
  }

  function showComponent() {
    $(component).css("display", "block");
  }

  function hideComponent() {
    $(component).css("display", "none");
  }

  // component starts out hidden via css
  assignEventHandlers();