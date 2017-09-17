const restaurantChoose = (function() {

  // Dependencies
  // _utilities.shuffleArray
  const _utilities = require('../../utilities/utilities');
  const pubSub = require('../../utilities/pubSub');
  const restaurantChooseTmpl = require('./restaurantChoose-tmpl');
  const restaurantVisitedTmpl = require('../restaurantVisited/restaurantVisited-tmpl');
  const {Users} = require('../../models/userModel');
  const testUser = Users.create("christian", "password");

  // DOM
  const componentContainer = APP_CONTAINER.find('.js-restaurant-choose-container');
  const component = '.js-restaurant-choose';
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = `${component} .js-btn-next`; // not $('button.js-btn-next', template);
  const btnAlreadyVisited = `${component} .js-btn-already-visited`;
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

  // module variables
  let localSearchResultData = [];
  let currentSearchResultIndex = 0;

  // handleNextBtnClicked:
  // show a different result when user clicks next btn ('Not feeling this place')
  function handleNextBtnClicked() {
    console.log('handleNextBtnClicked');
    console.log('btnNextResult', btnNextResult);
    populateSearchResult();
  }

  // handleAlreadyVisitedBtnClicked
  // show the popup with the two go again/wouldn't go again buttons in it
  function handleAlreadyVisitedBtnClicked() {
    console.log('handleAlreadyVisitedBtnClicked');
    Users.update(testUser, "history", localSearchResultData[currentSearchResultIndex-1]);
    console.log('Users after update', Users);
    populateSearchResult();
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
      const userHistory = Users.get(testUser, "history");

      // Replace localSearchResultData with only the places
      // where the user has not been
      localSearchResultData = localSearchResultData.filter(function(placeObj) {
        return !userHistory.some(function(placeObj2) {
          return placeObj.id == placeObj2.id;
        });
      });
      console.log('array difference', localSearchResultData);

    }


    // shuffle localSearchResultData for showing a random result
    // is it better to only shuffle indexes? 
    _utilities.shuffleArray(localSearchResultData);
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
  }

  // render the view to the page
  function render() {
    console.log('restaurantChoose render');
    template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    componentContainer.html(template);
  }

  assignEventHandlers();

  return {
    render: render
  }

})();

module.exports = restaurantChoose;