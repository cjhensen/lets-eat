const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // utilities


  // DOM
  const element = $('.js-restaurant-choose');
  const template = $(restaurantChooseTmpl.generateTemplate());
  const restaurantTitle = $('.js-title', template); 
  const restaurantRating = $('.js-rating', template); 
  const restaurantImg = $('.js-img', template); 
  const btnNext = $('.js-btn-next', template); 

  // module variables
  let usedSearchResultIndexes = [];
  let searchResultData;

  // subscribed events
  pubSub.on('processSearchResults', resetSearchResultIndexes);
  pubSub.on('processSearchResults', resetCachedSearchResultData);
  pubSub.on('processSearchResults', populateSearchResult);
  pubSub.on('processSearchResults', cacheSearchResultData);

  // resetSearchResultIndexes:
  // empties the usedSearchResultIndexes array when receiving an event from processSearchResults (the initial button click)
  function resetSearchResultIndexes() {
    console.log('resetSearchResultIndexes');

    usedSearchResultIndexes = [];
  }

  function handleNextBtnClicked() {
    console.log('handleNextBtnClicked');

    populateSearchResult(searchResultData);
  }

  function resetCachedSearchResultData() {
    searchResultData = [];
  }
  // cacheSearchResultData:
  // saves result data to local array for reuse
  function cacheSearchResultData(data) {
    searchResultData = data;
  }

  // populateSearchResult:
  // fill in template with data received from restaurantSearch,
  // then render
  function populateSearchResult(searchResultData) {
    console.log('populateSearchResult');
    console.log('data from pubsub', searchResultData);

    // select random number from 0 to 49 (max results returned from API)
    // TODO: keep track of chosen random numbers
    let index = _utilities.randomIntBetweenNums(0, 4);
    console.log('index', index);

    // new index is generated at start of function
    // check the used indexes array
    // if the index is already in there, generate a new index and use that
    // otherwise, the original index is good to use
    usedSearchResultIndexes.forEach(function(usedIndex) {
      if(usedIndex === index) {
        usedSearchResultIndexes.push(index);
        index = _utilities.randomIntBetweenNums(0, 4);
      } else {
        console.log('nothing changes and index still goes forward');
        console.log('index all used up', index);
      }
    });

    // reset then set all element properties based on data
    restaurantTitle.empty();
    restaurantTitle.append(searchResultData[index].name);

    restaurantRating.empty();
    restaurantRating.append(searchResultData[index].rating);

    restaurantImg.attr('src', "");
    restaurantImg.attr('src', searchResultData[index].image_url);

    restaurantImg.attr('alt', "");
    restaurantImg.attr('alt', searchResultData[index].name);

    render();
  }

  function assignEventHandlers() {
    console.log('assignEventHandlers');
    btnNext.on('click', handleNextBtnClicked);
  }

  function render() {
    console.log('restaurantChoose render');
    element.append(template);
  }

  // render();
  assignEventHandlers();

  return {
    render: render
  }

})();