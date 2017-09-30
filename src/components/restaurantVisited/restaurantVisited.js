// restaurantVisited

  // Dependencies
  const globals = require('../../globals');
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');
  const utilities = require('../../utilities/utilities'); // for makeDbRequest
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

  // set up an object for db insertion based on schema
  let objForInsert = {};

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
    objForInsert = {
      id: currentRestaurant.id, 
      name: currentRestaurant.name, 
      price: currentRestaurant.price, 
      rating: currentRestaurant.rating, 
      url: currentRestaurant.url, 
      image_url: currentRestaurant.image_url
    };

    showComponent();
  }

  // handleBtnGoBackClicked:
  // updates the current user history and liked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnGoBackClicked() {
    console.log('handleBtnGoBackClicked');

    console.log('currentRestaurant', currentRestaurant);

    // Add restaurant to history list and liked list

    let data = {
      "history" : objForInsert,
      "liked": objForInsert
    };

    utilities.makeDbRequest('PUT', data).then(function(data) {
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
    let data = {
      "history" : objForInsert,
      "disliked" : objForInsert
    };

    utilities.makeDbRequest('PUT', data).then(function(data) {
      hideComponent();
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