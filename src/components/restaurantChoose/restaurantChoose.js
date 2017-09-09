const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // utilities: randomIntBetweenNums, shuffleArray


  // DOM
  const componentElementSelector = $('.js-restaurant-choose');
  let template = $(restaurantChooseTmpl.generateTemplate());
  const btnNextResult = $('.js-btn-next', template);
  const templateOptions = {};


  // subscribed events
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
    localSearchResultData = searchResultData;

    // shuffle localSearchResultData for showing a random result
    // is it better to only shuffle indexes? 
    _utilities.shuffleArray(localSearchResultData);
  }

  // populateSearchResult:
  // fill in template with local copy of search result data,
  // then render
  // Note* I am not handling the data being received in the pubsub for this function (no parameter)
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
    componentElementSelector.on('click', btnNextResult, handleNextBtnClicked);
  }

  // render the view to the page
  function render() {
    console.log('restaurantChoose render');
    template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    componentElementSelector.html(template);
  }

  assignEventHandlers();

  return {
    render: render
  }

})();