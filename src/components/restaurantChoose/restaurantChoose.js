const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // utilities


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
    
    // reset local data on new search
    localSearchResultData = [];

    // set local data equal to received search result data
    localSearchResultData = searchResultData;
  }

  // populateSearchResult:
  // fill in template with local copy of search result data,
  // then render
  // Note* I am not handling the data being received in the pubsub for this function (no parameter)
  function populateSearchResult() {
    console.log('populateSearchResult');

    console.log('localSearchResultData', localSearchResultData);

    // select random number from 0 to 49 (max results returned from API)
    // TODO: keep track of chosen random numbers
    let index = _utilities.randomIntBetweenNums(0, 4);
    console.log('index', index);

    templateOptions.title = localSearchResultData[index].name;
    templateOptions.rating = localSearchResultData[index].rating;
    templateOptions.img_src = localSearchResultData[index].image_url;
    templateOptions.img_alt = localSearchResultData[index].name;

    console.log('templateOptions', templateOptions);

    render();
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