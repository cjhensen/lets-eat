const restaurantVisited = (function() {

  // Dependencies
  const restaurantVisitedTmpl = require('./restaurantVisited-tmpl');
  const pubSub = require('../../utilities/pubSub');
  const {Users} = require('../../models/userModel');

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

  // handleBtnGoBackClicked:
  // updates the current user history and liked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnGoBackClicked() {
    console.log('handleBtnGoBackClicked');

    // Add restaurant to history list and liked list
    Users.update(currentUser, "history", currentRestaurant);
    Users.update(currentUser, "liked", currentRestaurant);

    console.log('Users after update', Users);
    // Send event to show next result in restaurantChoose
    pubSub.emit('showNextSearchResult');
  }

  // handleBtnNotGoBackClicked:
  // updates the current user history and disliked lists with currentRestaurant
  // emits event to show next search result in restaurantChoose
  function handleBtnNotGoBackClicked() {
    console.log('handleBtnNotGoBackClicked');

    // Add restaurant to history list and liked list
    Users.update(currentUser, "history", currentRestaurant);
    Users.update(currentUser, "disliked", currentRestaurant);

    console.log('Users after update', Users);
    // Send event to show next result in restaurantChoose
    pubSub.emit('showNextSearchResult');
  }

  function assignEventHandlers() {
    console.log('restaurantVisited assignEventHandlers');
    APP_CONTAINER.on('click', btnGoBack, handleBtnGoBackClicked);
    APP_CONTAINER.on('click', btnNotGoBack, handleBtnNotGoBackClicked);
  }

  function showComponent() {
    $(component).css("display", "block");
  }

  function hideComponent() {
    $(component).css("display", "none");
  }

  // component starts out hidden via css
  assignEventHandlers();

})();

module.exports = restaurantVisited;