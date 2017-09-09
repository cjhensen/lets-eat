const restaurantChoose = (function() {

  // modules:
  // restaurantChooseTmpl
  // pubSub
  // utilities


  // DOM
  const element = $('.js-restaurant-choose');
  // const template = $(restaurantChooseTmpl.generateTemplate()); doing this in render() instead
  const templateOptions = {};


  // subscribed events
  pubSub.on('processSearchResults', populateSearchResult);


  // populateSearchResult:
  // fill in template with data received from restaurantSearch,
  // then render
  function populateSearchResult(searchResultData) {
    console.log('populateSearchResult');
    console.log('data from pubsub', searchResultData);

    // select random number from 0 to 49 (max results returned from API)
    // TODO: keep track of chosen random numbers
    let index = _utilities.randomIntBetweenNums(0, 49);
    console.log('index', index);

    templateOptions.title = searchResultData[index].name;
    templateOptions.rating = searchResultData[index].rating;
    templateOptions.img_src = searchResultData[index].image_url;
    templateOptions.img_alt = searchResultData[index].name;

    console.log('templateOptions', templateOptions);

    render();
  }


  function render() {
    console.log('restaurantChoose render');
    const template = $(restaurantChooseTmpl.generateTemplate(templateOptions));
    element.html(template);
  }

  // render();
  // assignEventHandlers();

  return {
    render: render
  }

})();