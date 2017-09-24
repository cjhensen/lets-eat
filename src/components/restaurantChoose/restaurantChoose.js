// restaurantChoose

  // Dependencies
  // utilities.shuffleArray
  const globals = require('../../globals');
  const utilities = require('../../utilities/utilities');
  const pubSub = require('../../utilities/pubSub');
  const restaurantChooseTmpl = require('./restaurantChoose-tmpl');
  const restaurantVisitedTmpl = require('../restaurantVisited/restaurantVisited-tmpl');
  const {Users} = require('../../models/userModel');

  // DOM
  const componentContainer = globals.APP_CONTAINER.find('.js-restaurant-choose-container');
  const component = '.js-restaurant-choose';
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = `${component} .js-btn-next`;
  const btnAlreadyVisited = `${component} .js-btn-already-visited`;
  const btnBack = `${component} .js-btn-back`;
  const imgLink = `${component} .js-link-show-details`;
  const templateOptions = {};

  // Embedded Components
  let restaurantVisitedComponent = restaurantVisitedTmpl.generateTemplate();
  templateOptions.restaurantVisitedComponent = restaurantVisitedComponent;
  console.log('restaurantVisitedComponent', restaurantVisitedComponent);


  // Subscribed Events
  // first set the local data to the received data
  pubSub.on('processSearchResults', handleReceivedSearchResults);
  // then populate the serach result on the page
  pubSub.on('processSearchResults', populateSearchResult);
  pubSub.on('showNextSearchResult', populateSearchResult);

  // module variables
  let localSearchResultData = [];
  let currentSearchResultIndex = 0;

  // handleBtnBackClicked:
  // destroy choose view
  // render restaurant search view in restaurantSearch
  function handleBtnBackClicked() {
    console.log('handleNextBtnClicked');
    destroy();
    pubSub.emit('renderRestaurantSearch');
  }

  // handleImgLinkClicked:
  // prevent default scroll to top
  // emit event to send current restaurant to restaurantDetails so it can be displayed
  function handleImgLinkClicked(event) {
    console.log('handleImgLinkClicked');
    event.preventDefault();
    pubSub.emit('showDetailsView', localSearchResultData[currentSearchResultIndex-1]);
  }

  // handleNextBtnClicked:
  // show a different result when user clicks next btn ('Not feeling this place')
  function handleNextBtnClicked() {
    console.log('handleNextBtnClicked');
    console.log('btnNextResult', btnNextResult);
    populateSearchResult();

    pubSub.emit('destroyDetailsView');
  }

  // handleAlreadyVisitedBtnClicked
  // sends user and restaurant to restaurantVisited to show the popup with the two go 
  // again/wouldn't go again buttons in it and make those buttons add to their respective lists
  function handleAlreadyVisitedBtnClicked() {
    console.log('handleAlreadyVisitedBtnClicked');

    // Send currently shown restaurant in event to be added to liked/disliked from restaurantVisited popup
    pubSub.emit('displayVisitedPopup', {user: TEST_USER, restaurant: localSearchResultData[currentSearchResultIndex-1]});
  }

  // handleReceivedSearchResults:
  // Callback function for receiving search results from restaurantSearch.
  // Sets the results passed in to a local variable for reuse.
  // Clears existing data on new search by resetting the array, since this function is
  // only called on pubSub event when a new search is submitted.
  function handleReceivedSearchResults(searchResultData) {
    console.log('handleReceivedSearchResults');
    
    // reset local data and index on new search
    localSearchResultData = [];
    currentSearchResultIndex = 0;

    // set local data equal to received search result data
    localSearchResultData = searchResultData.data;

    const tryNew = searchResultData.tryNew;
    console.log('try new in handleReceivedSearchResults', tryNew);


    // if tryNew is true
    if(tryNew) {
      // get the user history
      const userHistory = Users.get(TEST_USER, "history");

      // Replace localSearchResultData with only the places
      // where the user has not been
      localSearchResultData = localSearchResultData.filter(function(placeObj) {
        return !userHistory.some(function(placeObj2) {
          return placeObj.id == placeObj2.id;
        });
      });
    }


    // shuffle localSearchResultData for showing a random result
    // is it better to only shuffle indexes? 
    utilities.shuffleArray(localSearchResultData);
  }

  // populateSearchResult:
  // fill in template with local copy of search result data,
  // then render
  // Note* I am not handling the data being received in the pubsub for this function (no parameter)
  // TODO: show something on last result
  function populateSearchResult() {
    console.log('populateSearchResult');

    console.log('localSearchResultData', localSearchResultData);

    if(currentSearchResultIndex < localSearchResultData.length) {
      templateOptions.title = localSearchResultData[currentSearchResultIndex].name;
      templateOptions.rating = localSearchResultData[currentSearchResultIndex].rating;
      templateOptions.img_src = localSearchResultData[currentSearchResultIndex].image_url;
      templateOptions.img_alt = localSearchResultData[currentSearchResultIndex].name;

      // increment index for next result
      currentSearchResultIndex++;

      render();
      pubSub.emit('destroyLoader');

      console.log('templateOptions', templateOptions);

    } else {
      console.log('end of result list');
    }

  }

  // assignEventHandlers:
  // assigns event handlers for component element events
  function assignEventHandlers() {
    console.log('assignEventHandlers');

    // Need to bind event handlers to parent DOM, so new elements added or replaced
    // don't lose their event functionality
    componentContainer.on('click', btnNextResult, handleNextBtnClicked);
    componentContainer.on('click', btnAlreadyVisited, handleAlreadyVisitedBtnClicked);
    componentContainer.on('click', imgLink, handleImgLinkClicked);
    componentContainer.on('click', btnBack, handleBtnBackClicked);
  }

  // render the view to the page
  function render() {
    console.log('restaurantChoose render');
    template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    componentContainer.html(template);
  }

  // destroy:
  // remove component from dom
  function destroy() {
    if($(component).length) {
      console.log('restaurantSearch destroy');
      $(component).remove();
    }
  }

  assignEventHandlers();

module.exports = {
  render: render
};